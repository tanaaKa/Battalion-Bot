const { Games } = require('../dbObjects.js');

module.exports = {
    async deleteGame(interaction, gameName) {
        try {
            //const childChannelsString = childChannels.map(c => c.id)
            //console.log(`Child channels: ${childChannelsString}`)
            // Delete attached channels from db
            const gameDetails = await Games.findOne({ where: { game_name: `${gameName}` }})
                .then(async sqlInfo => {
                    // Delete channels
                    const fetchedChannel = interaction.guild.channels.cache.find(r => r.id === sqlInfo.channel_text);
                    fetchedChannel.delete()
                    const fetched2Channel = interaction.guild.channels.cache.find(r => r.id === sqlInfo.channel_axis);
                    fetched2Channel.delete()
                    const fetched3Channel = interaction.guild.channels.cache.find(r => r.id === sqlInfo.channel_allies);
                    fetched3Channel.delete()
                    const category = interaction.guild.channels.cache.find(r => r.id === sqlInfo.category);
                    category.delete();

                    // Delete database row
                    await Games.destroy({ where: { game_name: `${gameName}` } })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }     
    }
}