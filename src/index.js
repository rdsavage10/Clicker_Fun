/*jshint esversion: 6 */
// lets declare some variables
let total = 0;
let counter = 0;
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
let current_time;
let current_ms;
let prev_ms = 0;
let prev_times = [];
// const catUpgradeText = [
//   'Give cats treats for clicking',
//   'Give cats lots of pets',
//   'Buy Catnip',
//   'Increase cat treats',
//   'Make a mouse click leaderboard for which cat has the most clicks',
// ];

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


//shortcut for changing button disabled state
function buttonDisabled(element, bool) {
  if (bool) {
    element.prop("disabled", true);
  } else {
    element.prop("disabled", false);
  }
}

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
  hireCat.text(catCost);
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

function fps() {
  current_time = new Date();
  current_ms = current_time.getTime();

  average = 1000 / current_ms - prev_ms;
  prev_times.push(current_ms);
  if (prev_times.length >= 100) {
    prev_times = prev_times.reduce((a,b) => a + b) / prev_times.length;
    // console.log(prev_time);

    fpsSpan.text(Math.round(average));
    prev_times = [];
  }
}

function button_update() {
  //flags for disabling buttons
  if (unusedClicks < 1) {
    buttonDisabled(clickButton, true);
  } else {
    buttonDisabled(clickButton, false);
  }
  if (50 <= counter) {
    buttonDisabled(autoBuyUnlockButton);
  }
  if (upgradeCost <= counter) {
    buttonDisabled(upgradeClickButton);
  }
  if (clickCost <= counter) {
    buttonDisabled(buyClickButton);
  }
  if (catCost <= counter) {
    buttonDisabled(hireCatButton);
  }
  // if (themes.theme1.cost <= counter) {
  //   buttonDisabled(themestore)
  // }
}

// main game loop
function paint() {
  button_update();
  // temporary fps counter
  fps();
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
