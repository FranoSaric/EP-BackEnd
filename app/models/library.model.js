module.exports = (sequelize, Sequelize) => {
    const Library = sequelize.define("library", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        }
    });

    return Library;
};
