const { Registration } = require('../dbObjects.js');
const { createEmbed } = require('../functions/createEmbed.js');
const Sequelize = require('sequelize');

module.exports = {
    async rank(interaction, user) {
        try {
            const user = interaction.options.getUser('user')
            //const rank = await Registration.findAll({ where: { name: `${user.username}` }, order: ['mmr'], attributes: ['mmr'] })
            const userQ = await Registration.findOne({
                attributes: [
                  'id',
                  'mmr',
                  [Sequelize.literal('RANK() OVER (ORDER BY "mmr" DESC)'), 'rank']
                ]})

            const count = await Registration.count()

            if (!userQ) {
                return { content: `User not found or not registered`, ephemeral: true }
            }

            console.log(`${user.username} ${userQ.dataValues.rank}`)
            return await createEmbed(`RANKING: ${user.username}`,`${user.username} is ranked **${userQ.dataValues.rank}**/**${count}**`)
        } catch (e) {
            console.log(e)
        }
    }
}