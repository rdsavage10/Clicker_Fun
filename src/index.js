/*jshint esversion: 6 */
'use strict';
let total = 0;
let prevTotal = 0;
let counter = 0;
let unusedClicks = 50;
let autoBuying = false;
let multiplier = 1;
let clickCost = 5;
let upgradeCost = 10;
let catCount = 0;
let catCost = 100;
let catMultiplier = 1;
let loopTicks = 1;
let avgClicks = 0;
let newClicks = 0;
const avgArr = [];
// let catLevel = 0;
let frameCount = 0;
let lastFrameCount = 0;
let prevMS = new Date().getMilliseconds();
let lastTheme = 'placeholder';
// const catUpgradeText = [
//   'Give cats treats for clicking',
//   'Give cats lots of pets',
//   'Buy Catnip',
//   'Increase cat treats',
//   'Make a mouse click leaderboard for which cat has the most clicks',
// ];

const $clickButton = $('#click');
const $buyClickButton = $('#buyClicks');
const $upgradeClickButton = $('#upgradeClick');
const $clickPerSecond = $('#avgClickSpan');
const $autoBuySection = $('#autoBuySection');
const $autoBuyToggleSection = $('#autoBuyToggleSection');
const $autoBuyToggleButton = $('#autoBuyToggle');
const $catCountSpan = $('#catCount');
const $hireCatButton = $('#hireCat');
const $fpsSpan = $('#fps');
const $autoBuyUnlockButton = $('#autoBuyUnlock');
const $button = $('button');
const $body = $('body');
const $themeStore = $('#themestore');
const $themeStoreButtons = $('button.buy-theme');
const $themes = $('#themes');
const $themeButtons = $('button.theme-button');

// change active theme
function changeTheme(theme) {

  $body.removeClass(lastTheme)
       .addClass(theme);
  $button.removeClass(lastTheme + '-button')
         .addClass(theme + '-button');
  lastTheme = theme;
}

function buyTheme(id) {

  if ($themes.is(':hidden')) {
    $themes.show();
  }

  $('#' + id).parent().remove();

  if ($themeStore.find('.buy-theme').length === 0) {
    $themeStore.remove();
  }

  id = id.slice(4);
  $('#' + id).show();
}

// clicking
function increase() {

  counter += multiplier;
  total += multiplier;
}


function buyClicks() {

  counter -= clickCost;
  unusedClicks += 2 * clickCost;
  clickCost += (Math.floor(clickCost * 0.125) + 1);
  $buyClickButton.text('$' + clickCost);
}

//upgrades click power
function upgradeClick() {

  multiplier += 2;
  counter -= upgradeCost;
  upgradeCost = Math.floor(upgradeCost * 1.5);
  $upgradeClickButton.text('$' + upgradeCost);
  $clickButton.text('+$' + multiplier);
}

//revenue per minute
function avgClickRate() {

  newClicks = total - prevTotal;
  prevTotal = total;
  avgArr.push(newClicks);
  if (avgArr.length > 10) {
    avgArr.splice(0,1);
  }
  avgClicks = avgArr.reduce((a,b) => a + b) / avgArr.length ;
  $clickPerSecond.text(Math.round(avgClicks));
}


// one time unlock of auto buying
function unlockAutoBuy() {

  autoBuying = true;
  $autoBuySection.remove();
  $autoBuyToggleSection.show();

}

// toggle autobuying on and off
function toggleAutoBuy() {

  if (autoBuying === true) {
    autoBuying = false;
    counter -= 50;
    $autoBuyToggleButton.text('Off');
  } else {
    autoBuying = true;
    $autoBuyToggleButton.text('On');
  }
}

// adds a cat
function hireCat() {

  catCount++;
  counter -= catCost;
  catCost += 25;
  if (catCount === 1) {
    $catCountSpan.text('1 cat');
  } else {
    $catCountSpan.text(catCount + ' cats');
  }
  $hireCatButton.text('$' + catCost);
}

// this how cats click
function catIncrease(count) {

  if (count > unusedClicks) {
    count = unusedClicks;
  }
  counter += count;
  total += count;
  unusedClicks -= count;
}

// upgrading how much $$$ cats make
// function catUpgrade(level) {
//
//
// }

function findFPS() {

  // let prevMS = new Date().getMilliseconds();
  let currentMS = new Date().getMilliseconds();
  if (prevMS > currentMS) {
    if (frameCount !== lastFrameCount) {
      $fpsSpan.text(frameCount);
    }
    lastFrameCount = frameCount;
    frameCount = 0;
  }
  frameCount++;
  prevMS = currentMS;

}

function buttonUpdate() {

  //flags for disabling buttons
    if (unusedClicks > 0 && unusedClicks > 0) {
      $clickButton.attr('disabled', false);
    } else {
      $clickButton.attr('disabled', true);
    }
    if (50 <= counter && unusedClicks > 0) {
      $autoBuyUnlockButton.attr('disabled', false);
    } else {
      $autoBuyUnlockButton.attr('disabled', true);
    }
    if (upgradeCost <= counter && unusedClicks > 0) {
      $upgradeClickButton.attr('disabled', false);
    } else {
      $upgradeClickButton.attr('disabled', true);
    }
    if (clickCost <= counter) {
      $buyClickButton.attr('disabled', false);
    } else {
      $buyClickButton.attr('disabled', true);
    }
    if (catCost <= counter && unusedClicks > 0) {
      $hireCatButton.attr('disabled', false);
    } else {
      $hireCatButton.attr('disabled', true);
    }
    if (counter >= 150 && unusedClicks > 0) {
      $themeStoreButtons.attr('disabled', false);
    } else {
      $themeStoreButtons.attr('disabled', true);
    }



}

// main game loop
function paint() {

  buttonUpdate();

  findFPS();

  //clicks per second
  if (loopTicks > 60) {
    loopTicks = 1;
    avgClickRate();
  } else {
    loopTicks++;
  }

  //auto buying unused clicks
  if (autoBuying === true) {
    if (counter > clickCost && unusedClicks <= 30) {
      buyClicks();
    }
  }

  // cat section (auto clicking)
  if (catCount !== 0) {
    if (loopTicks === 60) {
      catIncrease(catCount * catMultiplier);
    }
  } else if (counter >= catCost) {
    $('#catZone').show();
  }

  // unhiding theme section
  if ($('#themestore').is(':hidden') && counter >= 150) {
    $('#themestore').show();
  }

  // updating numbers on screen
  $('#wallet').text(counter);
  $('#unusedClicks').text(unusedClicks);
  window.requestAnimationFrame(paint);
}

/* add all event listeners */
$(document).ready(function() {

  $clickButton.on('click', function() {
    unusedClicks--;
    increase();
  });

  $hireCatButton.on('click', function() {
    unusedClicks--;
    hireCat();
  });

  $buyClickButton.on('click', function() {
    unusedClicks--;
    buyClicks();
  });

  $upgradeClickButton.on('click', function() {
    unusedClicks--;
    upgradeClick();
  });
  $autoBuyUnlockButton.on('click', function() {
    unusedClicks--;
    unlockAutoBuy();
  });
  $autoBuyToggleButton.on('click', function() {
    unusedClicks--;
    toggleAutoBuy();
  });

  $themeStoreButtons.on('click', function(e) {
    buyTheme(e.currentTarget.id);
  });

  $themeButtons.on('click', function(e) {
    changeTheme(e.currentTarget.id);
    unusedClicks--;
  });

  // .on('click', function() {
    //
    // });
  window.requestAnimationFrame(paint);
});
