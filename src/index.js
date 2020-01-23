// lets declare some variables
let total = 0
let counter = 0
let unusedClicks = 50
let autoBuying = false
let multiplier = 100
let clickCost = 5
let upgradeCost = 10
let catCount = 0
let catCost = 100
let catMultiplier = 1
let loopTicks = 1
let secondTimer = 1
let minuteTimer = 1
let secPrevTotal = 0
let minPrevTotal = 0
let catLevel = 0
let prev_time = 0
let root = document.documentElement
let catUpgradeText = [
  'Give cats treats for clicking',
  'Give cats lots of pets',
  'Buy Catnip',
  'Increase cat treats',
  'Make a mouse click leaderboard for which cat has the most clicks',
]
themes = {
  unlocked: false,
  theme0: {
    mainTextColor: 'black',
    bodyBackground: 'white',
  },
  theme1: {
    cost: 200,
    mainTextColor: 'white',
    bodyBackground: 'black',
  },
  theme2: {
    cost: 250,
    mainTextColor: 'grey',
    bodyBackground: 'blue',
  },
  theme3: {
    cost: 300,
    mainTextColor: 'red',
    bodyBackground: 'white',
  },
  font0: "'Times New Roman', Times, serif",
  font1:1 ,
  font2:1 ,
  font3:1 ,

}

//shortcut for setting innerHTML so much
function innerHTML(element, value) {
  document.getElementById(element).innerHTML = value
}

//shortcut for changing button disabled state
function buttonDisable(element, value) {
  document.getElementById(element).disabled = value
}

// change active theme
function changeTheme(theme) {
  root.style.setProperty('--main-text-color', theme.mainTextColor)
  root.style.setProperty('--body-background', theme.bodyBackground)
}


// clicking
function increase() {
  counter += (1 * multiplier)
  total += (1 * multiplier)

  unusedClicks--
}

// buys clicks. duh.
function buyClicks() {
  counter -= clickCost
  unusedClicks += 2 * clickCost
  clickCost += (Math.floor(clickCost * .125) + 1)
  innerHTML("buyClicks", clickCost)
}

//upgrades click power
function upgradeClick() {
  multiplier += 2
  counter -= upgradeCost
  upgradeCost = Math.floor(upgradeCost * 1.5)
  innerHTML("upgradeClick", upgradeCost)
  innerHTML("click", ("+$" + multiplier))
}

//revenue per minute
function clicksPerMinute() {
  secondTimer++
  minuteTimer++
  if (secondTimer >= 300) {
    innerHTML('clickPerSecond', (total - secPrevTotal / 5))
    secPrevTotal = total
    secondTimer = 1
  }
  if (minuteTimer >= 600) {
    innerHTML('clickPerMinute',(total - minPrevTotal * 6))
    minPrevTotal = total
    minuteTimer = 1
  }

}

// this auto buys clicks
function autoBuy() {
  autoBuying = true;
  document.getElementById('autoBuySection').hidden = true
  document.getElementById('autoBuyToggleSection').hidden = false
}

function autoBuyToggle() {
  if (autoBuying === true) {
    autoBuying = false;
    counter -= 50
    innerHTML('autoBuyToggle', "Off")
  } else {
    autoBuying = true;
    innerHTML('autoBuyToggle', "On")
  }
}

function hireCat() {
  catCount++
  counter -= catCost
  catCost += 25
  innerHTML('catCount', (catCount + " cats"))
  innerHTML('hireCat', catCost)
}

function catIncrease(count) {
  if (count > unusedClicks) {
    count = unusedClicks
  }
  counter += count
  total += count
  unusedClicks -= count
}

function catUpgrade(level) {

}

function fps() {
  current_time = new Date()
  current_ms = current_time.getTime()
  average = 1000 / (current_ms - prev_time)
  innerHTML('fps', Math.round(average))
  prev_time = current_ms
}

function button_update() {
  //flags for disabling buttons
  if (unusedClicks < 1) {
    buttonDisable("click", true)
  } else {
    buttonDisable("click", false)
  }
  if (50 <= counter) {
    buttonDisable("autoBuy", false)
  } else {
    buttonDisable("autoBuy", true)
  }
  if (upgradeCost <= counter) {
    buttonDisable("upgradeClick", false)

  } else {
    buttonDisable("upgradeClick", true)
  }
  if (clickCost <= counter) {
    buttonDisable("buyClicks", false)
  } else {
    buttonDisable("buyClicks", true)
  }
  if (catCost <= counter) {
    buttonDisable("hireCat", false)
  } else {
    buttonDisable("hireCat", true)
  }
  if (themes.theme1.cost <= counter) {
    buttonDisable("themestore", false)
  } else {
    buttonDisable("themestore", true)
  }
}

// main game loop
function paint() {
  button_update()
  // temporary fps counter
  fps()
  clicksPerMinute()
  //auto buying unused clicks
  if (autoBuying === true) {
    if (counter > clickCost && unusedClicks <= 30) {
      buyClicks()
    }
  }

  // cat section (auto clicking)
  if (catCount !== 0) {
    if (loopTicks < (100)) {
      loopTicks++
    } else {
      catIncrease(catCount * catMultiplier)
      loopTicks = 1
    }

  } else if (counter >= catCost) {
    document.getElementById('catZone').hidden = false
  }

  // unhiding theme section
  if (document.getElementById('themestore').hidden === true && counter >= 150) {
    document.getElementById("themestore").hidden = false
  }

  // updating numbers on screen
  innerHTML("count", counter)
  innerHTML("unusedClicks", unusedClicks)
  window.requestAnimationFrame(paint)

}


window.requestAnimationFrame(paint)
