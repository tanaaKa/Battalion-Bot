module.exports = {
    async createRinger(channel, player) {
        try {
            channel.permissionOverwrites.create(playerArray, { 
                [PermissionsBitField.Flags.ViewChannel]: true, 
                [PermissionsBitField.Flags.SendMessages]: true, 
                [PermissionsBitField.Flags.Speak]: true, 
                [PermissionsBitField.Flags.Connect]: true 
            })   
            const { PermissionsBitField } = require('discord.js');
        } catch (e) {
            console.log(e)
        } 
    }
}