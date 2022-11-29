const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const { Games, NAQueue, EUQueue, Servers } = require('../dbObjects.js');
const { buildTeams } = require('./buildTeams.js');
const { postInfo } = require('./postInfo.js');
const { handlePerms } = require('./handlePerms.js');

module.exports = {
    async createPUG(interaction, region) {
        try {
            //vars
            var players
            var playersArray
            var teamArray
            var axisTeam
            var axisCaptain
            var alliesTeam
            var alliesCaptain

            // Check to see if a server is available
            const availableServers = await Servers.findAll({ where: { region: `${region}`, in_use: false }})
            const serverString = availableServers.map(s => s.servername).join('\n') || 'No servers available'
            console.log(`Servers not in use: ${serverString}`)

            if (serverString === 'No servers available') {
                console.log(`Aborting PUG due to lack of servers`)
                interaction.channel.send(`No servers available in the ${region} region. Aborting PUG.`)
                return
            }

            // This is left over from the old system
            // TODO:
            //      - Pull unique ID from table instead
            // This is left over from the old system
            let data = fs.readFileSync('./gamecount.txt',{encoding:'utf8', flag:'r'});
            let gameName = `GAME ` + data

            // Create game entry in sql
            const game = await Games.create({
                game_name: gameName
            });
            console.log(`Successfully created a new game in the Games table: ${gameName}`)

            // Create player array for this game
            // Separated by region
            // TODO: Make this cleaner
            if (region === 'US') {
                players = await NAQueue.findAll({ attributes: ['user_id'] });
                // Set up teams
                playersArray = players.map(p => p.user_id) // Array for processing
                // Setup teams
                teamArray = await buildTeams(playersArray, 'US', gameName);
                //playersString = players.map(p => p.user_id).join(' ')
                axisTeam = teamArray[0]
                axisCaptain = axisTeam[0]
                alliesTeam = teamArray[1]
                alliesCaptain = alliesTeam[0]
            } else if (region === 'EU') {
                players = await EUQueue.findAll({ attributes: ['user_id'] });
                // Set up teams
                playersArray = players.map(p => p.user_id) // Array for processing
                // Setup teams
                teamArray = await buildTeams(playersArray, 'EU', gameName);
                //playersString = players.map(p => p.user_id).join(' ')
                axisTeam = teamArray[0]
                axisCaptain = axisTeam[0]
                alliesTeam = teamArray[1]
                alliesCaptain = alliesTeam[0]
            }
            // } else if (region === 'OCE') {
            //     players = await OCEQueue.findAll({ attributes: ['user_id'] });
            //     // Set up teams
            //     playersArray = players.map(p => p.user_id) // Array for processing
            //     // Setup teams
            //     teamArray = await buildTeams(playersArray, 'OCE', gameName);
            //     //playersString = players.map(p => p.user_id).join(' ')
            //     axisTeam = teamArray[0]
            //     axisCaptain = axisTeam[0]
            //     alliesTeam = teamArray[1]
            //     alliesCaptain = alliesTeam[0]
            // }

            // Setup channels
            await interaction.guild.channels.create({ name: `${gameName}`, type: 4, 
            permissionOverwrites: 
            [
                { 
                    id: interaction.guild.id, deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                },
                // Add pug mods
                {
                    id: `1008819356353953793`, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.SendMessages]
                },
                // Add admins
                {
                    id: `994980391003881572`, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.SendMessages]
                },
            ]}).then(async CategoryChannel => {
                // Add perms to channel
                await handlePerms(CategoryChannel, playersArray)
                
                // Store category info for deletion later
                try {
                    Games.update({ 
                        category: `${CategoryChannel.id}` }, 
                        { 
                            where: 
                            { 
                                game_name: `${gameName}` 
                            } 
                        });
                } catch (err) {
                    console.log(err)
                }
                // Create text channel for this game
                await interaction.guild.channels.create({ name: `${gameName}-info`, type: 0, parent: CategoryChannel }).then(async textChannel => {
                    // Store text channel
                    try {
                        await Games.update({ channel_text: `${textChannel.id}` }, { where: { game_name: `${gameName}` } });

                        await handlePerms(textChannel, playersArray)

                        // Show build information
                        await postInfo(interaction, textChannel, axisTeam, alliesTeam, axisCaptain, alliesCaptain, gameName, playersArray, region, teamArray[2], teamArray[3], teamArray[4], teamArray[5])
                    } catch (err) {
                        console.log(err)
                    }
                })
                await interaction.guild.channels.create({ name: `AXIS`, type: 2, parent: CategoryChannel, userLimit: 5, bitrate: 128000})
                .then(async channel => {
                    // Store channel info for axis
                    try {
                        await Games.update({ channel_axis: `${channel.id}` }, { where: { game_name: `${gameName}` } });

                        await handlePerms(channel, playersArray)
                    } catch (err) {
                        console.log(err)
                    }
                });
                await interaction.guild.channels.create({ name: `ALLIES`, type: 2, parent: CategoryChannel, userLimit: 5, bitrate: 128000})
                .then(async channel => {                   
                    // Store channel info for allies
                    try {
                        await Games.update({ channel_allies: `${channel.id}` }, { where: { game_name: `${gameName}` } });

                        await handlePerms(channel, playersArray)
                    } catch (err) {
                        console.log(err)
                    }
                })
                .finally(async () => { // Send notifs
                    await Games.findOne({ where: { game_name: `${gameName}` } })
                    .then(async gameInfo => {
                        //console.log(gameInfo)

                        // Notify #wartide
                        if (gameInfo) {
                            await interaction.channel.send(`**A new game has started:** <#${gameInfo.category}>\n*Please join your respective voice channels ASAP*\n\nGame info: <#${gameInfo.channel_text}>\n\n__Voice Channels__\nAXIS: <#${gameInfo.channel_axis}>\nALLIES: <#${gameInfo.channel_allies}>`);
                            //interaction.reply(`New game created and posted in <#994977969007239248>`);
                        } else {
                            console.log(`gameInfo returned undefined`)
                            await interaction.reply(`ERROR creating game manually. Check logs.`);
                        }
                    });  
                });
                
                // increment game count
                let newData = parseInt(data) + 1
                //console.log(newData)
                // write new count
                newData = newData.toString();
                fs.writeFileSync("gamecount.txt", newData);   
            }).catch(err => {console.log(err); interaction.reply(":red_circle: ERROR: Notify tanaKa#6402 so he can fix it.")});
        } catch (err) {
            console.log(err)
        } finally {
            // Clear queue for next game
            if (region === 'US') {
                NAQueue.destroy({
                    where: {},
                    truncate: true
                })
            } else if (region === 'EU') {
                EUQueue.destroy({
                    where: {},
                    truncate: true
                })
            }
        }
    }
}