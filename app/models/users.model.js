module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        indexNumber: {
            type: Sequelize.STRING,
        },
        userName: {
            type: Sequelize.STRING,
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        creationDate: {
            type: Sequelize.DATE,
        },
        studyYear: {
            type: Sequelize.INTEGER
        },
    });

    return Users;
};
