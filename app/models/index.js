const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    omitNull: true,
    operatorsAliases: 0,
    timezone: "+02:00"  ,
    dialectOptions: {
        useUTC: false, // for reading from database
    },
    additional: {
      timestamps: false
      // ...options added to each model
   },
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    define: {
      timestamps: false
  }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.kolegiji = require("../models/kolegiji.model.js")(sequelize, Sequelize);
db.korisnik = require("../models//korisnik.model.js")(sequelize, Sequelize);
db.uloga = require("../models/uloga.model.js")(sequelize, Sequelize);
db.studiji = require("../models/studiji.model.js")(sequelize, Sequelize);
db.termini = require("../models/termini.model.js")(sequelize, Sequelize);
db.ucionica = require("../models/ucionica.model.js")(sequelize, Sequelize);
db.evidencija = require("../models/evidencija.model.js")(sequelize, Sequelize);
db.kategorija= require("../models/kategorija.model.js")(sequelize, Sequelize);
db.knjiga= require("../models/knjiga.model.js")(sequelize, Sequelize);
db.knjiznica= require("../models/knjiznica.model.js")(sequelize, Sequelize);
db.knjigaknjiznica= require("../models/knjigaknjiznica.model.js")(sequelize, Sequelize);
db.statistika= require("../models/statistika.model.js")(sequelize, Sequelize);
db.ustanova= require("../models/ustanova.model.js")(sequelize, Sequelize);
db.studentKnjiga= require("../models/studentknjiga.model.js")(sequelize, Sequelize);

/*Veza 1-1*/
db.korisnik.hasMany(db.statistika)
db.statistika.belongsTo(db.korisnik)

db.ustanova.hasMany(db.knjiznica)
db.knjiznica.belongsTo(db.ustanova)

db.uloga.hasMany(db.korisnik, {foreignKey: 'ulogaFK', sourceKey: 'id'});
db.korisnik.belongsTo(db.uloga, {foreignKey: 'ulogaFK', targetKey: 'id'});

db.ustanova.hasMany(db.korisnik, {foreignKey: 'ustanovaFK', sourceKey: 'id'});
db.korisnik.belongsTo(db.ustanova, {foreignKey: 'ustanovaFK', targetKey: 'id'});

db.studiji.hasMany(db.kolegiji, {foreignKey: 'studijiFK', sourceKey: 'id'});
db.kolegiji.belongsTo(db.studiji, {foreignKey: 'studijiFK', targetKey: 'id'});

db.korisnik.hasMany(db.kolegiji, {foreignKey: 'osobljeFK', sourceKey: 'id'});
db.kolegiji.belongsTo(db.korisnik, {foreignKey: 'osobljeFK', targetKey: 'id'});

db.kolegiji.hasMany(db.termini, {foreignKey: 'kolegijiFK', sourceKey: 'id'});
db.termini.belongsTo(db.kolegiji, {foreignKey: 'kolegijiFK', targetKey: 'id'});

db.ucionica.hasMany(db.termini, {foreignKey: 'ucionicaFK', sourceKey: 'id'});
db.termini.belongsTo(db.ucionica, {foreignKey: 'ucionicaFK', targetKey: 'id'});

db.ucionica.hasMany(db.evidencija, {foreignKey: 'ucionicaFK', sourceKey: 'id'});
db.evidencija.belongsTo(db.ucionica, {foreignKey: 'ucionicaFK', targetKey: 'id'});

db.korisnik.hasMany(db.evidencija, {foreignKey: 'osobaFK', sourceKey: 'id'});
db.evidencija.belongsTo(db.korisnik, {foreignKey: 'osobaFK', targetKey: 'id'});

db.ustanova.hasMany(db.ucionica, {foreignKey: 'ustanovaFK', sourceKey: 'id'});
db.ucionica.belongsTo(db.ustanova, {foreignKey: 'ustanovaFK', targetKey: 'id'});

db.ustanova.hasMany(db.studiji, {foreignKey: 'ustanovaFK', sourceKey: 'id'});
db.studiji.belongsTo(db.ustanova, {foreignKey: 'ustanovaFK', targetKey: 'id'});

db.knjiznica.hasMany(db.knjigaknjiznica, {foreignKey: 'knjiznicaFK', sourceKey: 'id'});
db.knjigaknjiznica.belongsTo(db.knjiznica, {foreignKey: 'knjiznicaFK', targetKey: 'id'});

db.knjiga.hasMany(db.knjigaknjiznica, {foreignKey: 'knjigaFK', sourceKey: 'id'});
db.knjigaknjiznica.belongsTo(db.knjiga, {foreignKey: 'knjigaFK', targetKey: 'id'});

db.kategorija.hasMany(db.knjiga, {foreignKey: 'kategorijaFK', sourceKey: 'id'});
db.knjiga.belongsTo(db.kategorija, {foreignKey: 'kategorijaFK', targetKey: 'id'});

db.korisnik.hasMany(db.studentKnjiga, {foreignKey: 'osobaFK', sourceKey: 'id'});
db.studentKnjiga.belongsTo(db.korisnik, {foreignKey: 'osobaFK', targetKey: 'id'});

db.knjiga.hasMany(db.studentKnjiga, {foreignKey: 'knjigaFK', sourceKey: 'id'});
db.studentKnjiga.belongsTo(db.knjiga, {foreignKey: 'knjigaFK', targetKey: 'id'});


db.ULOGA = ["student", "djelatnik"];

module.exports = db;