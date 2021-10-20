module.exports = (sequelize, Sequelize) => {
    const StudentBook = sequelize.define("studentBook", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pickUpDate: {
            type: Sequelize.DATE,
        },
        returnDate: {
            type: Sequelize.DATE,
        },
    });

    return StudentBook;
};
