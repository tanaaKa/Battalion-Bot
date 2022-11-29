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

module.exports = { Registration, Games, PastGames, NAQueue, EUQueue, Servers };