const { SlashCommandBuilder } = require('@discordjs/builders');
const { Server } = require('http');
const { Servers } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeserver')
		.setDescription('[Admin only] Removes a server to the server database')
        .addStringOption(option => 
            option.setName('ip')
                .setDescription('The IP of the server')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('port')
                .setDescription('The port of the server')
                .setRequired(true)),

	async execute(interaction) {
        // Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }
        // gets vars inputted
        const ip = interaction.options.getString('ip');
        const port = interaction.options.getString('port');

        // Put vars in database
        try {
            const affectedRows = await Servers.destroy({ where: { ip: `${ip}`, port: `${port}` }})
            
            if (affectedRows > 0) {
                return interaction.reply({ content: `${ip}:${port} has been removed from the servers table`, ephemeral: false })
            } else {
                return interaction.reply({ content: `Server not found`, ephemeral: true })
            }
        } catch (e) {
            console.log(e)
        }
	},
};