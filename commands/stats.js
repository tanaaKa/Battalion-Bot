const { SlashCommandBuilder } = require('@discordjs/builders');
const { Registration } = require('../dbObjects.js');
const { createEmbed } = require('../functions/createEmbed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Look up the stats of a player')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to look up')
                .setRequired(true)),
	async execute(interaction) {
        try {
            const user = interaction.options.getUser('user')
            const stats = await Registration.findOne({ where: { user_id: `${user.id}` }})

            if (!stats) {
                await interaction.reply({ content: `User not found or not registered`, ephemeral: true })
                return
            }

            const reply = await createEmbed(`STATS: ${user.username}`,`Games Played: **${stats.games_played}**\nW/L: **${stats.wins}**/**${stats.losses}**\nMMR: **${stats.mmr}**`)

            await interaction.reply(reply)
        } catch (e) {
            console.log(e)
        }
	},
};