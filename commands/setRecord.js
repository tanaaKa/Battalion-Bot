const { SlashCommandBuilder } = require('@discordjs/builders');
const { Servers, Registration } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setrecord')
		.setDescription('[Admin only] Sets the W/L record of a player')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to adjust the W/L of')
                .setRequired(true))
        .addNumberOption(option => 
            option.setName('wins')
                .setDescription('Amount of wins')
                .setRequired(true))
            .addNumberOption(option => 
                option.setName('losses')
                    .setDescription('Amount of losses')
                    .setRequired(true)),

	async execute(interaction) {
        // Check if in admin
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

        try {
            // gets vars inputted
            const user = interaction.options.getUser('user');
            const wins = interaction.options.getNumber('wins');
            const losses = interaction.options.getNumber('losses');
            var response = ``
            var mmr = parseInt(1000)

            // Get server status
            const userEntry = await Registration.findOne({ where: { name: `${user.username}` } })

            if (!userEntry) {
                response = { content: `User not found or not registered`, ephemeral: true }
            } else {
                // mmr calculation
                mmr += ((`${wins}` * 10) + (`${losses}` * -7))
                //console.log(mmr)
                // Adjust their stats
                await Registration.update({ games_played: parseInt(wins + losses), wins: `${wins}`, losses: `${losses}`, mmr: `${mmr}` }, { where: { name: `${user.username}` } });
                response = { content: `${user.username} updated in the database with W/L **${wins}**/**${losses}** and **${mmr}** MMR`, ephemeral: true }
            }
            console.log(`${interaction.user.username} set ${user.username} to ${wins} wins / ${losses} losses`)
            return interaction.reply(response)
        } catch (e) {
            console.log(e)
        }
	},
};