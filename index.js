// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { NAQueue, EUQueue } = require('./dbObjects.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Build commands collection
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	// Empty queues
	NAQueue.destroy( { where: { }, truncate: true })
	EUQueue.destroy( { where: { }, truncate: true })
	console.log('Queues emptied');
	//Sync registration model
	console.log('Battalion Bot connected and running');
	client.user.setPresence({ activities: [{ name: 'Made by tanaKa' }], status: 'online' });
});

// Commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	//if (!interaction.isButton()) return;
	//console.log(interaction);

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);