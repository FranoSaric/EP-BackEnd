module.exports = (sequelize, Sequelize) => {
    const Exam = sequelize.define("exam", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: Sequelize.DATE,
        }
    });

    return Exam;
};
