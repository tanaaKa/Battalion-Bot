const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const { Registration, EUQueue, NAQueue } = require('../dbObjects.js');
const { createPUG } = require('../functions/createPUG')
const { naQueueUpdate } = require('../functions/naQueue.js')
const { euQueueUpdate } = require('../functions/euQueue.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('q')
		.setDescription('Queue into the PUG'),

	async execute(interaction) {
        var response
        var closed = false
        const playerInNAQueue = await NAQueue.findOne({ where: { user_id: `${interaction.user.id}` } })
        const playerInEUQueue = await EUQueue.findOne({ where: { user_id: `${interaction.user.id}` } })

        // Check if player in queue
        if (playerInNAQueue || playerInEUQueue) {
            console.log(`${interaction.user.username} found in queue already`)
            interaction.reply({ content: `You are already in a queue.`, ephemeral: true }).catch(e => {
                console.log(e)
            })
            return
        }
        
        // CLose pug function
        if (closed && interaction.channel.id !== `994977969007239248`) {
            interaction.reply({ content: `BNBOT queues are currently closed for maintenance`, ephemeral: true}).catch(e => {
                console.log(e)
            })
            return
        }

        // Verify player is registered first
        const playerRegistered = await Registration.findOne({ where: { user_id: `${interaction.user.id}` } })
        if (!playerRegistered) {
            interaction.reply({ content: `You must first register into the PUG system before you can queue.\n\nType \`/register\` in <#1008804468176977970>`, ephemeral: true }).catch(e => {
                console.log(e)
            })
            return
        };

        // NA QUEUE
        if (interaction.channel.name.toLowerCase() === 'na-pug' || interaction.channel.id === `994977969007239248`) {           
            console.log(`${interaction.user.username} not in queue. Adding`)
            // Get player MMR
            const user = await Registration.findOne({ where: { user_id: `${interaction.user.id}` } });
            const userMMR = user.mmr;
            console.log(`User MMR: ${userMMR}`)
            // Insert player into game
            await NAQueue.upsert({ username: interaction.user.username, user_id: interaction.user.id, user_mmr: userMMR})

            // Start game if queue is full
            const naQueueCount = await NAQueue.count()
            if (naQueueCount === 10) {
                await createPUG(interaction, 'US')
            }

            // Call queue update message
            await naQueueUpdate(interaction).then(msg => {
                interaction.channel.send(msg)
            });
            await interaction.reply({ content: `You've been added to the **NA** queue`, ephemeral: true }).catch(e => {
                console.log(e)
            })           
        } else if (interaction.channel.name.toLowerCase() === 'eu-pug') { // EU queue
            console.log(`Player not in queue. Adding`)
            // Get player MMR
            const user = await Registration.findOne({ where: { user_id: `${interaction.user.id}` } });
            const userMMR = user.mmr;
            console.log(`User MMR: ${userMMR}`)
            // Insert player into game
            await EUQueue.upsert({ username: interaction.user.username, user_id: interaction.user.id, user_mmr: userMMR})

            // Start game if queue is full
            const euQueueCount = await EUQueue.count()
            if (euQueueCount === 10) {
                await createPUG(interaction, 'EU')
            }

            // Call queue update message
            await euQueueUpdate(interaction).then(msg => {
                interaction.channel.send(msg)
            });
            await interaction.reply({ content: `You've been added to the **EU** queue.`, ephemeral: true }).catch(e => {
                console.log(e)
            })
        } else {
            await interaction.reply({ content: `This isn't the place for that. Go read #commands`, ephemeral: true }).catch(e => {
                console.log(e)
            })
        }
    }
};