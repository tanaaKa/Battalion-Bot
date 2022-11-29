const { SlashCommandBuilder } = require('@discordjs/builders');
const { Games } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearallgames')
		.setDescription('[Admin Only] Clears the active games list')
        ,
	async execute(interaction) {
        // Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

        // Clear Games
        await Games.destroy( { where: { }, truncate: true })
        
        // Reply
        await interaction.reply(`The games queue has been cleared`);
	},
};