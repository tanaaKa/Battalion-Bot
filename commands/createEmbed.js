const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { createEmbed } = require('../functions/createEmbed.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createembed')
		.setDescription('[Admin Only] Creates an embed message for a channel')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Channel to put the embed in')
				.setRequired(true))
		.addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the embed')
                .setRequired(true))
		.addStringOption(option =>
			option.setName('description')
				.setDescription('Description under the title')
				.setRequired(true)),
	async execute(interaction) {

		// Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

		try {
			const title = interaction.options.getString('title');
			const description = interaction.options.getString('description');
			const channel = interaction.options.getChannel('channel')

			// Create embed message
			const resp = createEmbed(title, description)

			await interaction.reply(resp);
		} catch (e) {
			console.log(e)
		}
	},
};