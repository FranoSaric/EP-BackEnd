module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("books", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        author: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING(1234),
        },
        imageUrl: {
            type: Sequelize.STRING,
        },
    });

    return Books;
};
