module.exports = (sequelize, DataTypes) => {
    return sequelize.define('servers', {
            servername: DataTypes.STRING,
            region: DataTypes.STRING,
            location: DataTypes.STRING,
            ip: DataTypes.STRING,
            port: DataTypes.STRING,
            queryport: DataTypes.STRING,
            password: DataTypes.STRING,
            connectstring: DataTypes.STRING,
            in_use: DataTypes.BOOLEAN
    }, {
    timestamps: false,
});
};