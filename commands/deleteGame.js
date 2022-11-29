const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteGameManually } = require('../functions/deleteGameMan.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletegame')
		.setDescription('[Admin only] Manually removes the game channels from the system')
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('The game number to delete. This should be an active category with channels under it')
                .setRequired(true)),

	async execute(interaction) {
        // Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

        await deleteGameManually(interaction)
	},
};