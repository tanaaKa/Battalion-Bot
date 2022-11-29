module.exports = (sequelize, DataTypes) => {
        return sequelize.define('naqueue', {
                username: DataTypes.STRING,
                user_id: DataTypes.STRING,
                user_mmr: DataTypes.INTEGER
        }, {
		timestamps: false,
	});
};