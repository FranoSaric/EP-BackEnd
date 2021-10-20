module.exports = (sequelize, Sequelize) => {
    const Statistics = sequelize.define("statistics", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        presence: {
            type: Sequelize.FLOAT,
        },
    });

    return Statistics;
};
