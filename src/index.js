
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
        let catChance = 1

        // clicking
        function increase() {
          counter += (1 * multiplier)
          unusedClicks--
          paint()
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
          counter -= 100
          document.getElementById('catCount').innerHTML = catCount + " cats"
        }

        function catIncrease() {
          // counter += (1 * multiplier * internCount)
          // unusedClicks-= internCount
          let chance = Math.floor(Math.random() * 100)
          if(unusedClicks > 0 && chance < catChance) {
            counter += (catMultiplier * catCount)
            unusedClicks--
          }
        }

        // main game loop
        function paint() {

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
          if (catCost <= counter ) {
            document.getElementById("hireCat").disabled = false
          } else {
            document.getElementById("hireCat").disabled = true
          }

          //auto buying unused clicks
          if (autoBuy === true) {
            if (counter > clickCost && unusedClicks <= 30) {
              buyClicks()
            }
          }

          // cat section (auto clicking)
          if(catCount !== 0) {
            catIncrease()
          } else if (counter >= 100) {
            document.getElementById('catZone').hidden = false
          }

          // updating numbers on screen
          document.getElementById("count").innerHTML = counter
          document.getElementById("unusedClicks").innerHTML = unusedClicks
        }

        setInterval(function(){
          paint()
        }, 100)
