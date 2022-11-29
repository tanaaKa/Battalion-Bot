const { SlashCommandBuilder } = require('@discordjs/builders');
const { Servers } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addserver')
		.setDescription('[Admin only] Adds a server to the server database')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the server')
                .setRequired(true))
        
        .addStringOption(option => 
            option.setName('region')
                .setDescription('US or EU only')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('location')
                .setDescription('City the server is located in')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('ip')
                .setDescription('Server IP')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('port')
                .setDescription('Server connect port')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('queryport')
                .setDescription('Server query port - different from the connect port')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('password')
                .setDescription('Server password')
                .setRequired(true)),

	async execute(interaction) {
        if (!interaction.member.roles.cache.some(newrole => newrole.name === 'ADMINS')) {
            await interaction.reply("This is an admin-only command!");
            return
        }

        // gets vars inputted
        const name = interaction.options.getString('name');
        const region = interaction.options.getString('region');
        const location = interaction.options.getString('location');
        const ip = interaction.options.getString('ip');
        const port = interaction.options.getString('port');
        const qport = interaction.options.getString('queryport');
        const password = interaction.options.getString('password');
        const connectString = `connect ${ip}:${port} password ${password}`
        var response

        // Put vars in database
        try {
            const affectedRows = await Servers.upsert({ 
                        servername: `${name}`,
                        region: `${region}` ,
						location: `${location}`, 
						ip: `${ip}`,
						port: `${port}`,
						queryport: `${qport}`,
						password: `${password}`,
						connectstring: `${connectString}`,
						in_use: false
					 })

            return interaction.reply({ content: `${region} - **${name}** has been added to the servers database with a connect string of:\n\`${connectString}\``, ephemeral: false })
        } catch (e) {
            console.log(e)
            if (err.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply({ content: `:red_circle: ERROR: There's already a server like this in the database`, ephemeral: false})
            }
        }
	},
};