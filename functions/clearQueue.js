const { NAQueue, EUQueue } = require('../dbObjects.js');
const { naQueueUpdate } = require('../functions/naQueue')
const { euQueueUpdate } = require('../functions/euQueue')

module.exports = {
    async clearQueue(interaction, region) {
         
        switch (region) {
            case 'US': 
            {
                await NAQueue.destroy( { where: { }, truncate: true })
                channel = interaction.guild.channels.cache.get('1008799249816879114')
                const updateMessage = await naQueueUpdate(interaction);
                channel.send(updateMessage)
                break
            }
            case 'EU': 
            {
                await EUQueue.destroy( { where: { }, truncate: true })
                channel = interaction.guild.channels.cache.get('1006926962729689119')
                const updateMessage = await euQueueUpdate(interaction);
                channel.send(updateMessage)
                break
            }
        }

        await interaction.reply({ content: `Queue Cleared`, ephemeral: true });
    }
}