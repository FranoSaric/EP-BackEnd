module.exports = (sequelize, Sequelize) => {
    const Studies = sequelize.define("studies", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
        },
        cycle: {
            type: Sequelize.STRING,
        },
    });

    return Studies;
};
