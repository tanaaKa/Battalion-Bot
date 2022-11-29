const { Registration, NAQueue, EUQueue, Servers } = require('../dbObjects.js');

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

module.exports = {
    async buildTeams(playerArray, region, gameName) {
        var axisTeam = []
        var alliesTeam = []
        var mmrArray = []
        // Parse on these so we can do math
        var avgMMR = parseFloat(0)
        var totalMMR = parseInt(0)
        var axisMMR = parseInt(0)
        var alliesMMR = parseInt(0)
        var highestMmr = 0
        var secondHighestMmr = 0

        // Process players in this pug
        try {
            console.log(`Building team array with ${playerArray}`)

            for (let i = 0; i < playerArray.length; i++) {
                // get this players mmr
                const user = await Registration.findOne({ where: { user_id: `${playerArray[i]}` }})
                // add to mmr array
                mmrArray.push([user.name,user.mmr])
            }   
            console.log(`mmrArray: ${mmrArray}`)

            // Add up total MMR
            for (let i = 0; i < mmrArray.length; i++) {
                totalMMR += parseInt(mmrArray[i][1])
            }
            console.log(`Total MMR: ${totalMMR}`)
            // Convert to float for division
            avgMMR = parseFloat(totalMMR) / parseFloat(10)
            
            // Sort the array of MMRs
            mmrArray.sort( function(a, b) {
                return (a[0] - b[0]) || (a[1] - b[1]);
            });
            console.log(`Sorted mmrArray (low to high): ${mmrArray}`)
            // reverse array so desc
            mmrArray.reverse()
            console.log(`Reversed mmrArray (High to low): ${mmrArray}`)
            // Select highest MMR and second highest for captains
            highestMmr = mmrArray[0,1]
            secondHighestMmr = mmrArray[1,1]
            console.log(`Highest MMR: ${mmrArray[0,1]}. Setting to axis captain`)
            console.log(`Second Highest MMR: ${mmrArray[1,1]}. Setting to allies captain`)
            // build team manually
            for (let i = 0; i < mmrArray.length; i++) {
                var player = ``
                if (region === 'US') {
                    //console.log(`mmrArray Value ${mmrArray[i]}`)
                    player = await NAQueue.findOne({ where: { user_mmr: `${mmrArray[i][1]}`, username: `${mmrArray[i][0]}`}})
                } else {
                    //console.log(`mmrArray Value ${mmrArray[i]}`)
                    player = await EUQueue.findOne({ where: { user_mmr: `${mmrArray[i][1]}`, username: `${mmrArray[i][0]}`}})
                }
                // Split teams by mmr order
                if (i % 2 == 0) {
                    axisTeam.push(`${mmrArray[i][0]}`)
                    const val = parseInt(mmrArray[i][1])
                    axisMMR += val
                } else {
                    alliesTeam.push(`${mmrArray[i][0]}`)
                    // Add total side MMR
                    const val = parseInt(mmrArray[i][1])
                    alliesMMR += val
                }
            } 

            console.log(`Final axisTeam array: ${axisTeam}`)
            console.log(`Final alliesTeam array: ${alliesTeam}`)
            
            // Log teams to database
            await Servers.update({ axis_team: `${axisTeam}`, allies_team: `${alliesTeam}` }, { where: { game_name: `${gameName}` } });

        } catch (e) {
            console.log(e)
        }

        console.log(`Axis team array: ${axisTeam}\nAllies team array: ${alliesTeam}`)
        
        return [axisTeam,alliesTeam,axisMMR,alliesMMR,avgMMR,totalMMR]
    }
}