module.exports = (sequelize, Sequelize) => {
    const Termini = sequelize.define("termini", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      datum: {
        type: Sequelize.DATE
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      trajanje: {
        type: Sequelize.FLOAT
      }
    });
  
    return Termini;
  };