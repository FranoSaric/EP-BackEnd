module.exports = (sequelize, Sequelize) => {
    const Terms = sequelize.define("terms", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: Sequelize.DATE,
        },
        startTime: {
            type: Sequelize.DATE,
        },
        endTime: {
            type: Sequelize.DATE,
        },
        duration: {
            type: Sequelize.FLOAT,
        },
    });

    return Terms;
};
