module.exports = (sequelize, Sequelize) => {
    const UserClaim = sequelize.define("userClaim", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    });

    return UserClaim;
};
