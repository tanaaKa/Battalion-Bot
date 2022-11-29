const { SlashCommandBuilder } = require('@discordjs/builders');
const { NAQueue, EUQueue } = require('../dbObjects.js');
const { naQueueUpdate } = require('../functions/naQueue.js')
const { euQueueUpdate } = require('../functions/euQueue.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lq')
		.setDescription('Leave the pug queue'),
	async execute(interaction) {
        var inNAQ
        var inEUQ
        var response
        // Check if player in queue
        inNAQ = await NAQueue.findOne({ where: { user_id: `${interaction.user.id}` }});
        inEUQ = await EUQueue.findOne({ where: { user_id: `${interaction.user.id}` }});
        if (inNAQ) {
            NAQueue.destroy( { where: { user_id: `${interaction.user.id}` } })
            response = { content: `:green_circle: You left queue`, ephemeral: true }
            const updateMessage = await naQueueUpdate(interaction);
            interaction.channel.send(updateMessage)
        } else if (inEUQ) {
            EUQueue.destroy( { where: { user_id: `${interaction.user.id}` } })
            response = { content: `:green_circle: You left queue`, ephemeral: true }
            const updateMessage = await euQueueUpdate(interaction);
            interaction.channel.send(updateMessage)
        } else {
            response = { content: `:red_circle: ERROR: You are not in queue`, ephemeral: true }
        }

		await interaction.reply(response);
	},
};