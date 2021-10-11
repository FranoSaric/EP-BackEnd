module.exports = (sequelize, Sequelize) => {
    const Studiji = sequelize.define("studiji", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      naziv: {
        type: Sequelize.STRING
      },
      godina: {
        type: Sequelize.INTEGER
      },
      ciklus: {
        type: Sequelize.STRING
      }
    });
  
    return Studiji;
  };