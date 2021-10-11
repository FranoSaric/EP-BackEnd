module.exports = (sequelize, Sequelize) => {
    const Kategorija = sequelize.define("kategorija", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      naziv: {
        type: Sequelize.STRING
      },
    });
  
    return Kategorija;
  };