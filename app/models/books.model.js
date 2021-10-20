module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("books", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        barCode: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
        },
        author: {
            type: Sequelize.STRING,
        },
    });

    return Books;
};
