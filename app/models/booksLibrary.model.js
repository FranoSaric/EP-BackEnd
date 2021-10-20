module.exports = (sequelize, Sequelize) => {
    const BooksLibrary = sequelize.define("booksLibrary", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    return BooksLibrary;
};
