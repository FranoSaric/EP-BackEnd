module.exports = (sequelize, Sequelize) => {
  const Uloga = sequelize.define("uloga", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    naziv: {
      type: Sequelize.STRING
    }
  });

  return Uloga;
};