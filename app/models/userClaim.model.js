module.exports = (sequelize, Sequelize) => {
    const UserClaim = sequelize.define("userClaim", {
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

    return UserClaim;
};
