const { SlashCommandBuilder } = require('@discordjs/builders');
const { createPUG } = require('../functions/createPUG.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('creategame')
		.setDescription('[Admin only] Manually creates a game with respective channels'),

    async execute(interaction) {
        // Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

        // Call main driver
        await createPUG(interaction, 'US')
    }
};