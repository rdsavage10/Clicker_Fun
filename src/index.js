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
// let catUpgradeText = [
//   'Give cats treats for clicking',
//   'Give cats lots of pets',
//   'Buy Catnip',
//   'Increase cat treats',
//   'Make a mouse click leaderboard for which cat has the most clicks',
// ]

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
  document.getElementById("buyClicks").innerHTML = clickCost
}

//upgrades click power
function upgradeClick() {
  multiplier += 2
  counter -= upgradeCost
  upgradeCost = Math.floor(upgradeCost * 1.5)
  document.getElementById("upgradeClick").innerHTML = upgradeCost
  document.getElementById("click").innerHTML = "+$" + multiplier
}

//revenue per minute
function clicksPerMinute() {
  secondTimer++
  minuteTimer++
  if (secondTimer >= 300) {
    document.getElementById('clickPerSecond').innerHTML = (total - secPrevTotal) / 5
    secPrevTotal = total
    secondTimer = 1
  }
  if (minuteTimer >= 600) {
    document.getElementById('clickPerMinute').innerHTML = (total - minPrevTotal) * 6
    minPrevTotal = total
    minuteTimer = 1
  }

}

// this auto buys clicks
function autoBuy() {
  autoBuying = true
  counter -= 50
  document.getElementById('autoBuySection').hidden = true
  document.getElementById('autoBuyToggleSection').hidden = false
}

function autoBuyToggle() {
  if (autoBuying === true) {
    autoBuying = false;
    document.getElementById('autoBuyToggle').innerHTML = "Off"
  } else {
    autoBuying = true;
    document.getElementById('autoBuyToggle').innerHTML = "On"
  }
}

function hireCat() {
  catCount++
  counter -= catCost
  catCost += 25
  document.getElementById('catCount').innerHTML = catCount + " cats"
  document.getElementById('hireCat').innerHTML = catCost
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
  document.getElementById('fps').innerHTML = Math.round(average)
  prev_time = current_ms
}

function button_update() {
  //flags for disabling buttons
  if (unusedClicks < 1) {
    document.getElementById("click").disabled = true
  } else {
    document.getElementById("click").disabled = false
  }
  if (50 <= counter) {
    document.getElementById("autoBuy").disabled = false
  } else {
    document.getElementById("autoBuy").disabled = true
  }
  if (upgradeCost <= counter) {
    document.getElementById("upgradeClick").disabled = false
  } else {
    document.getElementById("upgradeClick").disabled = true
  }
  if (clickCost <= counter) {
    document.getElementById("buyClicks").disabled = false
  } else {
    document.getElementById("buyClicks").disabled = true
  }
  if (catCost <= counter) {
    document.getElementById("hireCat").disabled = false
  } else {
    document.getElementById("hireCat").disabled = true
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

  // updating numbers on screen
  document.getElementById("count").innerHTML = counter
  document.getElementById("unusedClicks").innerHTML = unusedClicks
  window.requestAnimationFrame(paint)

}

window.requestAnimationFrame(paint)
