const { EmbedBuilder } = require('discord.js');
const { Registration } = require('../dbObjects.js');

module.exports = {
    async gameResults(interaction, gameName, result, serverName, axisTeam, alliesTeam, reporter) {
        try {
            var axisChanges = ``
            var axisString = axisTeam.join(', ')
            var alliesString = alliesTeam.join(', ')
            var alliesChanges = ``

            // Show mmr changes
            for (let i = 0; i < axisTeam.length; i++) {
                const player = await Registration.findOne({ where: { name: `${axisTeam[i]}`}})
                axisChanges += `\`${axisTeam[i]}\` => \`${player.mmr}\`\n`
            }
            for (let i = 0; i < alliesTeam.length; i++) {
                const player = await Registration.findOne({ where: { name: `${alliesTeam[i]}`}})
                alliesChanges += `\`${alliesTeam[i]}\` => \`${player.mmr}\`\n`
            }
            // report to game-results
            const channel = interaction.guild.channels.cache.find(r => r.id === '1009972266295119963');
            const title = `${gameName} finished`
            const description = `${gameName} has completed as a(n) ${result} on ${serverName} by ${reporter}`
            const resultsembed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${title}`)
                .setAuthor({ name: `BNBOT`, iconURL: 'https://i.imgur.com/DswAX6l.png', url: 'https://discord.js.org' })
                .setDescription(`${description}`)
                .setThumbnail('https://i.imgur.com/DswAX6l.png')
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'AXIS', value: `${axisString}`, inline: true },
                    { name: 'MMR CHANGE', value: `${axisChanges}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'ALLIES', value: `${alliesString}`, inline: true },
                    { name: 'MMR CHANGE', value: `${alliesChanges}`, inline: true },
                )
                .setTimestamp()
            channel.send({embeds: [resultsembed]})
        } catch (e) {
            console.log(e)
        } 
    }
}