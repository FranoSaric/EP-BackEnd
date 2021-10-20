module.exports = (sequelize, Sequelize) => {
    const RoleClaim = sequelize.define("roleClaim", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        claimType: {
            type: Sequelize.STRING,
        },
        claimValue: {
            type : Sequelize.STRING
        }
    });

    return RoleClaim;
};
