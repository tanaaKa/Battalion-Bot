const { SlashCommandBuilder } = require('@discordjs/builders');
const { clearQueue } = require('../functions/clearQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearqueue')
		.setDescription('[Admin Only] Clears the pug queue')
        .addStringOption(option =>
            option.setName('region')
                .setDescription('Queue to clear')
                .setRequired(true)
                .addChoices(
                    { name: 'US', value: 'US' },
                    { name: 'EU', value: 'EU' }
                )),
	async execute(interaction) {
        // Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

        const region = interaction.options.getString('region');
        clearQueue(interaction, region)
	},
};