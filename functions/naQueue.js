const { NAQueue } = require('../dbObjects.js');
const { Op } = require("sequelize");
const { createEmbed } = require('./createEmbed.js');

module.exports = {
    async naQueueUpdate (interaction) {
        let naString = ``
        const naQueueCount = await NAQueue.count()

        const naNames = await NAQueue.findAll({ where: { username: {[Op.ne]: null} } })
        const naNamesString = naNames.map(p => p.username).join('  |  ')

        if (naNames.length > 0) {
            naString = `<#1008799249816879114> : **${naQueueCount}/10**\n\n > ${naNamesString}`
        } else {
            naString = `<#1008799249816879114> : **${naQueueCount}/10**\n`
        }
        return createEmbed(`NA Queue`,naString)
    }
}