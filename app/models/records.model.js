module.exports = (sequelize, Sequelize) => {
    const Records = sequelize.define("records", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        checkInTime: {
            type: Sequelize.DATE,
        },
    });

    return Records;
};
