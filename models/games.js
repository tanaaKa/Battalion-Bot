module.exports = (sequelize, DataTypes) => {
	return sequelize.define('games', {
		game_name: DataTypes.STRING,
        axis_team: DataTypes.STRING, // Collection of players
        allies_team: DataTypes.STRING, // Collection of players
        channel_text: DataTypes.STRING,
        channel_axis: DataTypes.STRING, // Axis Voice channel ID
        channel_allies: DataTypes.STRING, // Allies Voice channel ID
        category: DataTypes.STRING // Category ID
	});
};