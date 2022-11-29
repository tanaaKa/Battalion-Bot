const { PermissionsBitField } = require('discord.js');
let sleep = async (ms) => await new Promise(r => setTimeout(r,ms));

module.exports = {
    async handlePerms (channel, playerArray) {
        try {
            if (Array.isArray(playerArray)) {
                //console.log(`Setting up player perms with array: ${playerArray}`)
                playerArray.forEach(async player => {
                    console.log(`HandlePerms processing ${player}`)
                    channel.permissionOverwrites.create(player, { 
                        [PermissionsBitField.Flags.ViewChannel]: true, 
                        [PermissionsBitField.Flags.SendMessages]: true, 
                        [PermissionsBitField.Flags.Speak]: true, 
                        [PermissionsBitField.Flags.Connect]: true 
                    })

                    await sleep(1000)
                })
            } else {
                //console.log(`HandlePerms processing ${playerArray}`)
                channel.permissionOverwrites.create(playerArray, { 
                    [PermissionsBitField.Flags.ViewChannel]: true, 
                    [PermissionsBitField.Flags.SendMessages]: true, 
                    [PermissionsBitField.Flags.Speak]: true, 
                    [PermissionsBitField.Flags.Connect]: true 
                })
            }  
        } catch (e) {
            console.log(e)
        } 
    }
}