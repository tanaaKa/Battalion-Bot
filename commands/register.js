const { SlashCommandBuilder } = require('@discordjs/builders');
const { Registration } = require('../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register into the PUG system')
        .addStringOption(option =>
            option.setName('region')
                .setDescription('Region to Join - NA, EU, SA, or OCE')
                .setRequired(true)
                .addChoices(
                    { name: 'US', value: 'US' },
                    { name: 'EU', value: 'EU' },
                    { name: 'SA', value: 'SA' },
                    { name: 'OCE', value: 'OCE' },
                )),
	async execute(interaction) {
        // Check if in bot channel (for now)
        if (interaction.channel.name.toLowerCase() != 'register') {
            await interaction.reply({ content:"You must \`/register\` in <#1008804468176977970>", ephemeral: true });
            return
        }

        try {
            // Get region role
            // console.log(`${interaction.options.get('region').value}`)
            const role = interaction.guild.roles.cache.find(role => role.name === `${interaction.options.get('region').value}`)

            if (role) {
                // Add role
                console.log(`Adding ${role.name} to ${interaction.user.username}`)
                await interaction.member.roles.add(role);                
            }          

            // Try to add to db
            const reg = await Registration.create({
				name: interaction.user.username,
				user_id: interaction.user.id,
				email: interaction.user.email,
			});
            await interaction.reply({ content: `:green_circle: Successfully registered into the PUG system!\n\n__You can now queue into NA and EU PUGS. Check <#1008802058486423553> for instructions__: `, ephemeral: true }).catch(e => {
                console.log(e)
            })
        } catch (err) {
            console.log(err)
            if (err.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply({ content: `:red_circle: ERROR: You are already registered! We've added the role to you just in case you wanted it.`, ephemeral: true}).catch(e => {
                    console.log(e)
                })
            }
            return interaction.reply({ content: `:red_circle: ERROR: A generic error occured. Notify tanaKa#6402 to fix it.`, ephemeral: true}).catch(e => {
                console.log(e)
            })
        }
	},
};