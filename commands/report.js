const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report a player for misconduct')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to report')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for report')
                .setRequired(true)),
	async execute(interaction) {
        try {
            const user = interaction.options.getUser('user')
            const reason = interaction.options.getString('reason')
            const channel = interaction.guild.channels.cache.get('1010325257321717870')

            const reportString = `<@&1008819356353953793> - ${interaction.user.username} has submitted a new report:\n\n**Player:** ${user}\n**Reason:** ${reason}`

            await channel.send({ content: `${reportString}`})
            await interaction.reply({ content: `Report sent to pug moderators`, ephemeral: true})
        } catch (e) {
            console.log(e)
        }
	},
};