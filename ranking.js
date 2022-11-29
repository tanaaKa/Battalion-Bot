const { SlashCommandBuilder } = require('@discordjs/builders');
const { Registration } = require('../dbObjects.js');
const { createEmbed } = require('../functions/createEmbed.js');
const Sequelize = require('sequelize');
const { rank } = require('../functions/rank.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ranking')
		.setDescription('Shows your ranking')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to look up')
                .setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user')
        
        const reply = await rank(interaction, user)

        await interaction.reply(reply)
	},
};