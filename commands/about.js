const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('About this bot'),
	async execute(interaction) {
        await interaction.reply({ content: 'Sent!', ephemeral: true})
		await interaction.user.send('This bot is a creation by <@107575622968053760> as a way to give back to the people still playing this buggy mess called Battalion 1944. Be good to each other, for each other is all we have.\n\nFeature requests, bug fixes, and suggestions can be sent to tanaKa#6402\nGithub coming soon.\n\nBuy tanaKa a coffee: https://ko-fi.com/tbillsen');
	},
};