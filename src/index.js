// lets declare some variables
let counter = 0
let unusedClicks = 50
let autoBuy = false
let multiplier = 1
let clickCost = 5
let upgradeCost = 10
let catCount = 0
let catCost = 100
let catMultiplier = 1
let loopTicks = 1
let catUpgradeText = [
  'Give cats treats for clicking',
  'Give cats lots of pets',
  'Buy Catnip',
  'Increase cat wages',
  'Make a mouse click leaderboard for which cat has the most clicks',
]
let prev_time = 0

// clicking
function increase() {
  counter += (1 * multiplier)
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
}

// this auto buys clicks
function autoBuyer() {
  autoBuy = true
  counter -= 50
  document.getElementById('autoBuySection').hidden = true
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
    document.getElementById("autoBuyer").disabled = false
  } else {
    document.getElementById("autoBuyer").disabled = true
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

  //auto buying unused clicks
  if (autoBuy === true) {
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
