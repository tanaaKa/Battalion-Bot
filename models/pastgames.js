module.exports = (sequelize, DataTypes) => {
	return sequelize.define('pastgames', {
		game_name: DataTypes.STRING,
        axis_team: DataTypes.STRING, // Collection of players
        allies_team: DataTypes.STRING, // Collection of players
        result: DataTypes.STRING // Category ID
	});
};