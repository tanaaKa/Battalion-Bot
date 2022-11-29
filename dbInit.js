const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Registration = require('./models/registration.js')(sequelize, Sequelize.DataTypes);
const Games = require('./models/games.js')(sequelize, Sequelize.DataTypes);
const PastGames = require('./models/pastgames.js')(sequelize, Sequelize.DataTypes);
const NAQueue = require('./models/naqueue.js')(sequelize, Sequelize.DataTypes);
const EUQueue = require('./models/euqueue.js')(sequelize, Sequelize.DataTypes);
const Servers = require('./models/servers.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	// Add default values for testing
	const servers = [
		Servers.upsert({ 
			servername: `BNBOT US DC 1`,
			region: `US` ,
			location: `Washington DC`, 
			ip: `144.126.153.41`,
			port: `33200`,
			queryport: `33215`,
			password: `torch`,
			connectstring: `connect 144.126.153.41:33200 password torch`,
			in_use: false
		}),
		Servers.upsert({ 
			servername: `BNBOT US DC 2`,
			region: `US` ,
			location: `Washington DC`, 
			ip: `144.126.153.18`,
			port: `30600`,
			queryport: `30615`,
			password: `torch`,
			connectstring: `connect 144.126.153.62:30600 password torch`,
			in_use: false
		}),
		// EU Servers
		Servers.upsert({ 
			servername: `BNBOT EU Falkenstein 1`,
			region: `EU` ,
			location: `Falkenstein`, 
			ip: `162.55.6.34`,
			port: `33215`,
			queryport: `32717`,
			password: `Shadow10s`,
			connectstring: `connect 162.55.6.34:33215 password Shadow10s`,
			in_use: false
		}),
		Servers.upsert({ 
			servername: `BNBOT EU FRANKFURT 1`,
			region: `EU` ,
			location: `Frankfurt`, 
			ip: `176.57.173.240`,
			port: `38600`,
			queryport: `38615`,
			password: `frankfurt`,
			connectstring: `connect 176.57.173.240:38600 password frankfurt`,
			in_use: false
		}),

		Servers.upsert({ 
			servername: `BNBOT EU FRANKFURT 2`,
			region: `EU` ,
			location: `Frankfurt`, 
			ip: `176.57.173.240`,
			port: `38631`,
			queryport: `32414`,
			password: `frankfurt`,
			connectstring: `connect 176.57.173.240:38600 password frankfurt`,
			in_use: false
		}),

		Servers.upsert({ 
			servername: `BNBOT EU Frankfurt 3`,
			region: `EU` ,
			location: `Frankfurt`, 
			ip: `176.57.168.31`,
			port: `31200`,
			queryport: `31215`,
			password: `KANKdX9A`,
			connectstring: `connect 176.57.168.31:31200 password KANKdX9A`,
			in_use: false
		}),
	]

	Promise.all(servers)
	
	console.log('Database wiped and synced');
	sequelize.close();
}).catch(console.error);