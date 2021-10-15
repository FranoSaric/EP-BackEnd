module.exports = (sequelize, Sequelize) => {
    const Institutions = sequelize.define("institutions", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        giroAccount: {
            type: Sequelize.BIGINT,
        },
        contact: {
            type: Sequelize.STRING,
        },
    });

    return Institutions;
};
