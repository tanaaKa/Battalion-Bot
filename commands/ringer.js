const { SlashCommandBuilder } = require('@discordjs/builders');
const { handlePerms } = require('../functions/handlePerms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ringer')
		.setDescription('Adds a ringer to your PUG')
		.addUserOption(option => 
            option.setName('user')
                .setDescription('User to ring')
                .setRequired(true)),
	async execute(interaction) {
		try {
			const ringer = interaction.options.getUser('user').id

			await handlePerms(interaction.channel.parent, ringer)
			
			await interaction.reply(`<@${ringer}> added to this PUG`);
		} catch (e) {
			console.log(e)
		}
	},
};