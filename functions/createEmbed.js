const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    async createEmbed(title, description) {
        // Create embed message
			const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${title}`)
			.setAuthor({ name: `BNBOT`, iconURL: 'https://i.imgur.com/DswAX6l.png', url: 'https://discord.js.org' })
			.setDescription(`${description}`)
			.setThumbnail('https://i.imgur.com/DswAX6l.png')
			.setTimestamp()

			return {embeds: [embed]}
    }
}