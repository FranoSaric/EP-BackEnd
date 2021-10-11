module.exports = (sequelize, Sequelize) => {
    const Knjiznica = sequelize.define("knjiznica", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    });
  
    return Knjiznica;
  };