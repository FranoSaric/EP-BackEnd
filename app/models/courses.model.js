module.exports = (sequelize, Sequelize) => {
    const Courses = sequelize.define("courses", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        academicYear: {
            type: Sequelize.DATE,
        },
        semester: {
            type: Sequelize.INTEGER,
        },
    });

    return Courses;
};
