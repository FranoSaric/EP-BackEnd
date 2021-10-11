module.exports = (sequelize, Sequelize) => {
    const Ustanova = sequelize.define("ustanova", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      naziv: {
        type: Sequelize.STRING
      },
      adresa: {
        type: Sequelize.STRING
      },
      ziroracun: {
        type: Sequelize.INTEGER
      },
      kontakt: {
        type: Sequelize.STRING
      }
    });
  
    return Ustanova;
  };