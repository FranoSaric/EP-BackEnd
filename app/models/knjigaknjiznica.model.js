module.exports = (sequelize, Sequelize) => {
    const KnjigaKnjiznica = sequelize.define("knjiga_knjiznica", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    });
  
    return KnjigaKnjiznica;
  };