const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Games } = require('../dbObjects');

module.exports = {
    async deleteGameManually(interaction) {
        try {
            // Get the category from the command
            const category = interaction.options.getChannel('category');

            // Button builder to have a "ARE YOU SURE" button
            const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('yes')
					.setLabel('Yes')
					.setStyle(3),
			);

            await interaction.reply({ content: `Are you sure you want to delete ${category.name}?`, ephemeral: true, components: [row] });
            
            // If yes is clicked
            const filterYes = i => i.customId === 'yes';
            const yescollector = interaction.channel.createMessageComponentCollector({ filterYes, time: 15000 });
            yescollector.on('collect', async i => {
                try {
                    // Delete channels in category
                    const childChannels = interaction.guild.channels.cache.filter(c => c.parentId === category.id);
                    //const childChannelsString = childChannels.map(c => c.id)
                    //console.log(`Child channels: ${childChannelsString}`)
                    // Delete attached channels from db
                    const gameDetails = await Games.findOne({ where: { game_name: `${category.name}` }})
                        .then(sqlInfo => {
                            const fetchedChannel = interaction.guild.channels.cache.find(r => r.id === sqlInfo.channel_text);
                            fetchedChannel.delete()
                            const fetched2Channel = interaction.guild.channels.cache.find(r => r.id === sqlInfo.channel_axis);
                            fetched2Channel.delete()
                            const fetched3Channel = interaction.guild.channels.cache.find(r => r.id === sqlInfo.channel_allies);
                            fetched3Channel.delete()
                            // Delete database row
                            Games.destroy({ where: { game_name: `${category.name}` } })
                            // delete category
                            category.delete();
                    }).catch(e => {
                        console.log(e)
                    })
  
                await i.update({ content: `${category.name} deleted`, components: [] });
                } catch (e) {
                    console.log(e)
                }     
            });
        } catch (err) {
            console.log(err)
            return interaction.reply({ content: `:red_circle: ERROR: A generic error occured. Notify tanaKa#6402 to fix it.`, ephemeral: true})
        }
    }
}