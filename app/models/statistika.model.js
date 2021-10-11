module.exports = (sequelize, Sequelize) => {
    const Statistika = sequelize.define("statistika", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,   
        autoIncrement: true
      },
      prisutnost: {
          type: Sequelize.FLOAT
      }
    });
  
    return Statistika;
  };
  