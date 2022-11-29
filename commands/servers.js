const { SlashCommandBuilder } = require('@discordjs/builders');
const { Servers } = require('../dbObjects.js');
const wait = require('node:timers/promises').setTimeout;
const { createEmbed } = require('../functions/createEmbed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('servers')
		.setDescription('Provides info and status for Battalion servers'),

    async execute(interaction) {
        let finalMessage = `__**NA**__`

        // Gather NA servers
        const availableServers = await Servers.findAll({ where: { region: `US` } })
        // Collect server data
        for (let i = 0; i < availableServers.length; i++) {
            finalMessage = finalMessage + `\n**Server:** ${availableServers[i].dataValues.servername}\n**Password:** ${availableServers[i].dataValues.password}\n**In use:** ${availableServers[i].dataValues.in_use}\n`
        }
        // Gather EU servers
        const availableEUServers = await Servers.findAll({ where: { region: `EU` } })
        // Alter str
        finalMessage += `\n\n__**EU**__`
        // Collect server data
        for (let i = 0; i < availableEUServers.length; i++) {
            finalMessage = finalMessage + `\n**Server:** ${availableEUServers[i].dataValues.servername}\n**Password:** ${availableEUServers[i].dataValues.password}\n**In use:** ${availableEUServers[i].dataValues.in_use}\n`
        }

        finalMessage += `\nCheck out <#1009160080190603274> to add your server here`

        const reply = await createEmbed(`ACTIVE SERVERS`,finalMessage)

        await interaction.deferReply();
        await wait(2000);
        await interaction.editReply(reply)

    }
};