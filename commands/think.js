const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('think')
		.setDescription('Provides knowledge'),
	async execute(interaction) {
		await interaction.reply(`Please enjoy it, don't overthink it. Just play with your mates.`);
	},
};