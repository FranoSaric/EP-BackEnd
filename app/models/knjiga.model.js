module.exports = (sequelize, Sequelize) => {
    const Knjiga = sequelize.define("knjiga", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      barcode: {
        type: Sequelize.STRING
      },
      naziv: {
        type: Sequelize.STRING
      },
      autor: {
        type: Sequelize.STRING
      },
    });
  
    return Knjiga;
  };