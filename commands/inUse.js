const { SlashCommandBuilder } = require('@discordjs/builders');
const { Server } = require('http');
const { Servers } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inuse')
		.setDescription('[Admin only] Toggles a server as no longer in use')
        .addStringOption(option => 
            option.setName('server')
                .setDescription('The name of the server')
                .setRequired(true)),

	async execute(interaction) {
        const isAdmin = interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')
        const isMod = interaction.member.roles.cache.some(newrole => newrole.name === 'PUG Moderators')
        // Check if in admin
        if (!isAdmin) {
            await interaction.reply("This is an admin-only command!").catch(e => {
                console.log(e)
            });
            return
        }

        // gets vars inputted
        const name = interaction.options.getString('server');
        var response

        // Put vars in database
        try {
            // Get server status
            const status = await Servers.findOne({ where: { servername: `${name}` } })

            if (status.in_use) {
                await Servers.update({ in_use: false }, { where: { servername: `${name}` } });
                response = { content: `${name} no longer marked as in use`, ephemeral: false }
            } else if (!status.in_use) {
                await Servers.update({ in_use: true }, { where: { servername: `${name}` } });
                response = { content: `${name} marked as in use`, ephemeral: false }
            } else {
                response = { content: `${name} not found`, ephemeral: false }
            }

            return interaction.reply(response).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
	},
};