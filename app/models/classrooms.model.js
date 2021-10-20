module.exports = (sequelize, Sequelize) => {
    const Classrooms = sequelize.define("classrooms", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        numberOfClassroom: {
            type: Sequelize.STRING,
        },
        numberOfSeats: {
            type: Sequelize.INTEGER,
        },
        floor: {
            type: Sequelize.INTEGER,
        },
        free: {
            type: Sequelize.BOOLEAN,
        },
    });

    return Classrooms;
};
