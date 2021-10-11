module.exports = (sequelize, Sequelize) => {
  const Osoba = sequelize.define("korisnik", {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,   
      autoIncrement: true
    },
    brojIndexa: {
      type:Sequelize.STRING
    },
    username:{
      type: Sequelize.STRING
    },
    ime: {
      type: Sequelize.STRING
    },
    prezime: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    lozinka: {
      type: Sequelize.STRING
    },
    datumKreiranja:{
      type: Sequelize.DATE
    }
  });

  return Osoba;
};
