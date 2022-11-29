const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');
const { Servers, Registration, PastGames, Games } = require('../dbObjects.js');
const { deleteGame } = require('./deleteGame.js')
const Sequelize = require('sequelize');
const { gameResults } = require('./gameResults.js');

module.exports = {
    async postInfo(interaction, textChannel, axisTeam, alliesTeam, axisCaptain, alliesCaptain, gameName, playersArray, region, axisMMR, alliesMMR, avgMMR, totalMMR) {
        var server
        var result
        var winningTeam
        var losingTeam
        maps = ['Liberation','Coastal','Manorhouse','Invasion','Derailed','Docks','Vanguard','Savoia']
        map = maps[Math.floor(Math.random() * maps.length)];
        if (region === 'US') { // NOTE: Duplicate code due to async issues
            try {
                // Pick a server
                server = await Servers.findOne({ where: { 
                    region: 'US',
                    in_use: false
                        }})
    
                // Set it to inuse
                await Servers.update({ in_use: true }, { where: { servername: `${server.servername}` } });
        
            } catch (e) {
                console.log(e)
            } 
        } else {
            try {
                // Pick a server
                server = await Servers.findOne({ where: { 
                    region: 'EU',
                    in_use: false
                        }})

                // Set it to in use
                await Servers.update({ in_use: true }, { where: { servername: `${server.servername}` } });
            } catch (e) {
                console.log(e)
            }
        }

        //console.log(`server.servername = ${server.servername}`)

        // Setup the button menu
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('axiswin')
					.setLabel('Axis Win')
					.setStyle(3),
                new ButtonBuilder()
					.setCustomId('allieswin')
					.setLabel('Allies Win')
					.setStyle(3),
                new ButtonBuilder()
					.setCustomId('cancel')
					.setLabel('Cancel Game')
					.setStyle(4)
			);
        
        // If yes is clicked
        // Filter to allow captains only to click buttons
        const victorycollector = textChannel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 8000000 });
        victorycollector.on('collect', async i => {
            const axisCaptainInfo = await Registration.findOne({ where: { name: `${axisCaptain}` } })
            const alliesCaptainInfo = await Registration.findOne({ where: { name: `${alliesCaptain}` } })
            console.log(`Reporting game\nAxis captain: ${axisCaptain}\nAllies captain: ${alliesCaptain}\nClicker: ${i.user.username}\nClicker ID: ${i.user.id}\nAxix Captain ID: ${axisCaptainInfo.user_id}`)          

            if (i.user.id === `${axisCaptainInfo.user_id}` || i.user.id === `${alliesCaptainInfo.user_id}`) {
                try {
                    if (i.customId === 'axiswin') {
                        result = `Axis Win`
                        winningTeam = `Axis`
                        losingTeam = `Allies`
                        // AXIS WIN LOOP
                        for (let i = 0; i < axisTeam.length; i++) {
                            // increase total games played
                            await Registration.update({ games_played: Sequelize.literal('games_played + 1') }, { where: { name: `${axisTeam[i]}` } })
                            // increase games won
                            await Registration.update({ wins: Sequelize.literal('wins + 1') }, { where: { name: `${axisTeam[i]}` } })
                            // add mmr
                            await Registration.update({ mmr: Sequelize.literal('mmr + 10') }, { where: { name: `${axisTeam[i]}` } })
                        }
                        // ALLIES LOSS LOOP
                        for (let i = 0; i < alliesTeam.length; i++) {
                            // increase total games played
                            await Registration.update({ games_played: Sequelize.literal('games_played + 1') }, { where: { name: `${alliesTeam[i]}` } })
                            // increase games lost
                            await Registration.update({ losses: Sequelize.literal('losses + 1') }, { where: { name: `${alliesTeam[i]}` } })
                            // remove mmr
                            await Registration.update({ mmr: Sequelize.literal('mmr - 7') }, { where: { name: `${alliesTeam[i]}` } })
                        }
                    } else if (i.customId === 'allieswin') {
                        result = `Allies Win`
                        winningTeam = `Allies`
                        losingTeam = `Axis`
                        // ALLIES WIN LOOP
                        for (let i = 0; i < alliesTeam.length; i++) {
                            // increase total games played
                            await Registration.update({ games_played: Sequelize.literal('games_played + 1') }, { where: { name: `${alliesTeam[i]}` } })
                            // increase games won
                            await Registration.update({ wins: Sequelize.literal('wins + 1') }, { where: { name: `${alliesTeam[i]}` } })
                            // add mmr
                            await Registration.update({ mmr: Sequelize.literal('mmr + 10') }, { where: { name: `${alliesTeam[i]}` } })
                        }
                        // AXIS LOSS LOOP
                        for (let i = 0; i < axisTeam.length; i++) {
                            // increase total games played
                            await Registration.update({ games_played: Sequelize.literal('games_played + 1') }, { where: { name: `${axisTeam[i]}` } })
                            // increase games lost
                            await Registration.update({ losses: Sequelize.literal('losses + 1') }, { where: { name: `${axisTeam[i]}` } })
                            // remove mmr
                            await Registration.update({ mmr: Sequelize.literal('mmr - 7') }, { where: { name: `${axisTeam[i]}` } })
                        }
                    } else if (i.customId === 'cancel') { // Game is cancelled
                        console.log(`${gameName} cancelled by ${i.user.username}`)
                        result = `cancel`
                        await deleteGame(interaction, gameName)
                        // Set server no longer in use
                        const affectedRows = await Servers.update({ in_use: false }, { where: { servername: `${server.servername}` } });
                        // report as cancel
                        // report to game-results
                        var serverName = `${server.servername}`
                        await gameResults(interaction, gameName, result, serverName, axisTeam, alliesTeam, i.user.username)

                        return
                    }
    
                    // Set server no longer in use
                    const affectedRows = await Servers.update({ in_use: false }, { where: { servername: `${server.servername}` } });
    
                    // Build ending embed
                    const endEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`${gameName} REPORTED by ${i.user.username}`)
                    .setURL('https://i.imgur.com/Va7vhJd.png')
                    .setAuthor({ name: `BATTALION BOT`, iconURL: 'https://i.imgur.com/DswAX6l.png' })
                    .setDescription('5v5 RANKED PUG ENDED')
                    .setThumbnail('https://i.imgur.com/DswAX6l.png')
                    .addFields(
                        { name: `AXIS - ${axisMMR}`, value: `Captain: ${axisCaptain}\n${axisTeam}` },
                        { name: `ALLIES - ${alliesMMR}`, value: `Captain: ${alliesCaptain}\n${alliesTeam}` },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'GAME REPORTED', value: `${result}`},
                        { name: 'RESULTS', value: `The ${winningTeam} have been rewarded +10 MMR. The ${losingTeam} have lost 7 MMR. \`/stats\` for individual stats.` }
                    )
                    //.setImage('') - TODO: Add minimap images
                    .setTimestamp()
                    .setFooter({ text: 'BNBOT 1.0 by tanaKa', iconURL: 'https://i.imgur.com/DswAX6l.png' });
    
                    // Move data over to the pastGames table
                    await PastGames.create({ game_name: `${gameName}`, 
                        axis_team: `${axisTeam}`,
                        allies_team: `${alliesTeam}`,
                        result: `${result}`
                    });
    
                    await i.update({ embeds: [endEmbed], components: [] });
                    // report to game-results
                    var serverName = `${server.servername}`
                    await gameResults(interaction, gameName, result, serverName, axisTeam, alliesTeam, i.user.username)
    
                    textChannel.send(`${notifString}\n\nThe game has been reported by **${i.user.username}** as an **${result}**\nYou may see your new MMR in <#1009972266295119963>\n\nIf this incorrect, please use \`/report\`\n\nThis channel will be deleted in 1 minute`)
    
                    await new Promise(r => setTimeout(r, 60000));
                    await deleteGame(interaction, gameName) 
                    
                } catch (e) {
                    console.log(e)
                }  
            } else {
                i.reply({ content: `These buttons are for this games captains only`, ephemeral: true });
            }   
        })

        //console.log(`Server selected: ${server.servername}`)
        //console.log(`Server connectstring: ${server.connectstring}\n`)
        // Add embed
        const startEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${gameName}`)
        .setURL('https://i.imgur.com/Va7vhJd.png')
        .setAuthor({ name: `BATTALION BOT`, iconURL: 'https://i.imgur.com/DswAX6l.png' })
        .setDescription('5v5 RANKED PUG')
        .setThumbnail('https://i.imgur.com/DswAX6l.png')
        .addFields(
            { name: `AXIS - ${axisMMR}`, value: `Captain: ${axisCaptain}\n${axisTeam}` },
            { name: `ALLIES - ${alliesMMR}`, value: `Captain: ${alliesCaptain}\n${alliesTeam}` },
            { name: '\u200B', value: '\u200B' },
            { name: 'MAP', value: `${map}`, inline: true },
            { name: 'SERVER', value: `${server.servername}`, inline: true },
            { name: 'MMR STATS', value: `Total MMR in PUG: ${totalMMR}\nAxis MMR: ${axisMMR}\nAllies MMR: ${alliesMMR}\nAverage MMR: ${avgMMR}`},
            { name: '\u200B', value: '\u200B' },
            { name: 'REPORTING GAME', value: 'The game reporting will be available after the game begins'}
        )
        //.setImage('') - TODO: Add minimap images
        .setTimestamp()
        .setFooter({ text: 'BNBOT 1.0 by tanaKa', iconURL: 'https://i.imgur.com/DswAX6l.png' });

        textChannel.send({ embeds: [startEmbed], components: [row] })

        let notifString = ``
        for (let i = 0; i < playersArray.length; i++) {
            if (!notifString) {
                notifString = `<@${playersArray[i]}> `
            } else {
                notifString = notifString + `<@${playersArray[i]}> `
            }    
        }

        // Send connect info
        textChannel.send(`${notifString}`)
        textChannel.send(`Connect:\n\`${server.connectstring}\`\nsteam://connect/${server.ip}:${server.port}/${server.password}`)
    }
}