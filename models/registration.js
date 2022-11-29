module.exports = (sequelize, DataTypes) => {
	return sequelize.define('registration', {
		name: {
            type: DataTypes.STRING,
            unique: true,
        },
        user_id: DataTypes.STRING,
        email: DataTypes.STRING,
        games_played: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        wins: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        losses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        kills: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        deaths: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        kdr: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        mmr: {
            type: DataTypes.INTEGER,
            defaultValue: 1000,
            allowNull: false,
        }
	});
};