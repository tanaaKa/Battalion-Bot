const { SlashCommandBuilder } = require('@discordjs/builders');
const { Registration } = require('../dbObjects.js');
const Sequelize = require('sequelize');
const { createEmbed } = require('../functions/createEmbed.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the top twenty players in the server'),
	async execute(interaction) {
        var season = `PRESEASON`
        var topArray = []
        // Find top twnty players
        const topten = await Registration.findAll({
            order: [
                ['mmr','desc']
            ],
            attributes: [
                'name','mmr'
            ],
            limit: 20,
            raw: true
        })
        //console.log(topten)

        const nameMap = topten.map(p => p.name)
        const mmrMap = topten.map(p => p.mmr)
        //console.log(`${nameMap[0]}:${mmrMap[0]}`)
        var message = ``
        var place = parseInt(1)
        for (let i = 0; i < nameMap.length; i++) {
            switch (place) {
                case 1:
                    message += `:first_place: ${nameMap[i]} (${mmrMap[i]})\n`
                    break           
                case 2: 
                    message += `:second_place: ${nameMap[i]} (${mmrMap[i]})\n`
                    break             
                case 3: 
                    message += `:third_place: ${nameMap[i]} (${mmrMap[i]})\n`
                    break           
                default:
                    message += `${place} - ${nameMap[i]} (${mmrMap[i]})\n`
            }           
            place++
        }

        var resp = await createEmbed(`${season} LEADERBOARD`,message)

        await interaction.reply(resp)
        
        // console.log(topten)
        // console.log(namesString)
	},
};