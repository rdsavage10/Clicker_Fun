/*jshint esversion: 6 */
// lets declare some variables
let total = 0;
let counter = 0;
let prev_counter;
let unusedClicks = 50;
let autoBuying = false;
let multiplier = 100;
let clickCost = 5;
let upgradeCost = 10;
let catCount = 0;
let catCost = 100;
let catMultiplier = 1;
let loopTicks = 1;
let secondTimer = 1;
let minuteTimer = 1;
let secPrevTotal = 0;
let minPrevTotal = 0;
let catLevel = 0;
let frameCount = 0;
let lastFrameCount = 0;
let prev_ms = new Date().getMilliseconds();
// const catUpgradeText = [
//   'Give cats treats for clicking',
//   'Give cats lots of pets',
//   'Buy Catnip',
//   'Increase cat treats',
//   'Make a mouse click leaderboard for which cat has the most clicks',
// ];
//jquery variables
const clickButton = $("#click");
const buyClickButton = $("#buyClicks");
const upgradeClickButton = $("#upgradeClick");
const clickPerSecond = $('#clickPerSecond');
const clickPerMinute = $('#clickPerMinute');
const autoBuySection = $('#autoBuySection');
const autoBuyToggleSection = $('#autoBuyToggleSection');
const autoBuyToggleButton = $('#autoBuyToggle');
const catCountSpan = $('#catCount');
const hireCatButton = $('#hireCat');
const fpsSpan = $('#fps');
const autoBuyUnlockButton = $("#autoBuyUnlock");
const themestoreButton = $("#themestore");


// change active theme
function changeTheme(id) {
  $("body").attr('class', '').addClass(id);
}

// clicking
function increase() {
  counter += multiplier;
  total += multiplier;
  unusedClicks--;
}

// buys clicks. duh.
function buyClicks() {
  counter -= clickCost;
  unusedClicks += 2 * clickCost;
  clickCost += (Math.floor(clickCost * 0.125) + 1);
  buyClickButton.text(clickCost);
}

//upgrades click power
function upgradeClick() {
  multiplier += 2;
  counter -= upgradeCost;
  upgradeCost = Math.floor(upgradeCost * 1.5);
  upgradeClickButton.text(upgradeCost);
  clickButton.text("+$" + multiplier);
}

//revenue per minute
function clicksPerMinute() {
  secondTimer++;
  minuteTimer++;
  if (secondTimer >= 300) {
    clickPerSecond.text((total - secPrevTotal) / 5);
    secPrevTotal = total;
    secondTimer = 1;
  }
  if (minuteTimer >= 600) {
    clickPerMinute.text((total - minPrevTotal) * 6);
    minPrevTotal = total;
    minuteTimer = 1;
  }
}

// this auto buys clicks
function autoBuy() {
  autoBuying = true;
  autoBuySection.hide();
  autoBuyToggleSection.show();
}

function autoBuyToggle() {
  if (autoBuying === true) {
    autoBuying = false;
    counter -= 50;
    autoBuyToggleButton.text("Off");
  } else {
    autoBuying = true;
    autoBuyToggleButton.text("On");
  }
}

function hireCat() {
  catCount++;
  counter -= catCost;
  catCost += 25;
  catCountSpan.text(catCount + " cats");
  hireCatButton.text(catCost);
}

function catIncrease(count) {
  if (count > unusedClicks) {
    count = unusedClicks;
  }
  counter += count;
  total += count;
  unusedClicks -= count;
}

function catUpgrade(level) {

}

function findFPS() {
  // let prev_ms = new Date().getMilliseconds();
  let current_ms = new Date().getMilliseconds();
  if (prev_ms > current_ms) {
    if (frameCount !== lastFrameCount) {
      fpsSpan.text(frameCount);
    }
    lastFrameCount = frameCount;
    frameCount = -1;
  }
  frameCount++;
  prev_ms = current_ms;

}

function button_update() {
  //flags for disabling buttons
    if (unusedClicks < 1) {
      clickButton.attr('disabled', true);
    } else {
      clickButton.attr('disabled', false);
    }
    if (50 <= counter) {
      autoBuyUnlockButton.attr('disabled', false);
    } else {
      autoBuyUnlockButton.attr('disabled', true);
    }
    if (upgradeCost <= counter) {
      upgradeClickButton.attr('disabled', false);
    } else {
      upgradeClickButton.attr('disabled', true);
    }
    if (clickCost <= counter) {
      buyClickButton.attr('disabled', false);
    } else {
      buyClickButton.attr('disabled', true);
    }
    if (catCost <= counter) {
      hireCatButton.attr('disabled', false);
    } else {
      hireCatButton.attr('disabled', true);
    }
    // if (themes.theme1.cost <= counter) {
    //   buttonDisabled(themestore)
    // }
}

// main game loop
function paint() {
  button_update();
  // temporary fps counter
  findFPS();
  clicksPerMinute();
  //auto buying unused clicks
  if (autoBuying === true) {
    if (counter > clickCost && unusedClicks <= 30) {
      buyClicks();
    }
  }

  // cat section (auto clicking)
  if (catCount !== 0) {
    if (loopTicks < (100)) {
      loopTicks++;
    } else {
      catIncrease(catCount * catMultiplier);
      loopTicks = 1;
    }

  } else if (counter >= catCost) {
    $('#catZone').show();
  }

  // unhiding theme section
  if ($('#themestore').is(":hidden") && counter >= 150) {
    $("#themestore").show();
  }

  // updating numbers on screen
  $("#wallet").text(counter);
  $("#unusedClicks").text(unusedClicks);
  window.requestAnimationFrame(paint);
}


/* add all event listeners */
$(document).ready(function() {
  $('button.theme-button').on('click', function(e) {
    changeTheme(e.currentTarget.id);
  });
  window.requestAnimationFrame(paint);
});
