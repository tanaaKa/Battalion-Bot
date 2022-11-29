const { SlashCommandBuilder } = require('@discordjs/builders');
const { Registration, Games, NAQueue, EUQueue } = require('../dbObjects.js');
const { createEmbed } = require('../functions/createEmbed.js');
const { Op } = require("sequelize");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('players')
		.setDescription('Shows players in queue and stats'),

	async execute(interaction) {
		// Reg'd users
		const totalGamers = await Registration.count()
		// Total active games
		const gamesActive = await Games.count()	
		// NA Q
		let naString = ``
        const naQueueCount = await NAQueue.count()

        const naNames = await NAQueue.findAll({ where: { username: {[Op.ne]: null} } })
        const naNamesString = naNames.map(p => p.username).join('  |  ')

        if (naNames.length > 0) {
            naString = `<#1008799249816879114> : **${naQueueCount}/10**\n\n > ${naNamesString}`
        } else {
            naString = `<#1008799249816879114> : **${naQueueCount}/10**\n`
        }
		// EU Q
		let euString = ``
        const euQueueCount = await EUQueue.count()

        const euNames = await EUQueue.findAll({ where: { username: {[Op.ne]: null } } })
        const euNamesString = euNames.map(p => p.username).join('  |  ')

        if (euNames.length > 0) {
            euString = `<#1006926962729689119> : **${euQueueCount}/10**\n\n > ${euNamesString}`
        } else {
            euString = `<#1006926962729689119> : **${euQueueCount}/10**\n`
        }

		const reply = await createEmbed(`ACTIVE PUG QUEUES`, `${naString}\n${euString}\nTotal Players: **${totalGamers}**\nActive PUGs: **${gamesActive}**`)
		await interaction.reply(reply)
	},
};