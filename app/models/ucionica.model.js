module.exports = (sequelize, Sequelize) => {
    const Ucionica = sequelize.define("ucionica", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      brojucionice: {
        type: Sequelize.STRING
      },
      brojmjesta: {
        type: Sequelize.INTEGER
      },
      kat: {
        type: Sequelize.INTEGER
      },
      slobodna: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Ucionica;
  };