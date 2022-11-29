const { EUQueue } = require('../dbObjects.js');
const { Op } = require("sequelize");
const { createEmbed } = require('./createEmbed.js');

module.exports = {
    async euQueueUpdate(interaction) {
        let euString = ``
        const euQueueCount = await EUQueue.count()

        const euNames = await EUQueue.findAll({ where: { username: {[Op.ne]: null } } })
        const euNamesString = euNames.map(p => p.username).join('  |  ')

        if (euNames.length > 0) {
            euString = `<#1006926962729689119> : **${euQueueCount}/10**\n\n > ${euNamesString}`
        } else {
            euString = `<#1006926962729689119> : **${euQueueCount}/10**\n`
        }
        return createEmbed(`EU Queue`,euString)
    }
}