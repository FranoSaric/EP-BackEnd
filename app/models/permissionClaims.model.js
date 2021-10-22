module.exports = (sequelize, Sequelize) => {
    const PermissionClaims = sequelize.define("permissionClaims", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: Sequelize.STRING,
        },
        value: {
            type: Sequelize.STRING,
        },
    });

    return PermissionClaims;
};
