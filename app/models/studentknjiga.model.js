module.exports = (sequelize, Sequelize) => {
    const StudentKnjiga = sequelize.define("student_knjiga", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      datumPodizanja:{
          type: Sequelize.DATE
      },
      datumPovratka:{
          type: Sequelize.DATE
      }
    });
  
    return StudentKnjiga;
  };