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

db.courses = require("../models/courses.model.js")(sequelize, Sequelize);
db.users = require("../models//users.model.js")(sequelize, Sequelize);
db.roles = require("../models/roles.model.js")(sequelize, Sequelize);
db.studies = require("../models/studies.model.js")(sequelize, Sequelize);
db.terms = require("../models/terms.model.js")(sequelize, Sequelize);
db.classrooms = require("../models/classrooms.model.js")(sequelize, Sequelize);
db.records = require("../models/records.model.js")(sequelize, Sequelize);
db.categories= require("../models/categories.model.js")(sequelize, Sequelize);
db.books= require("../models/books.model.js")(sequelize, Sequelize);
db.library= require("../models/library.model.js")(sequelize, Sequelize);
db.booksLibrary= require("../models/booksLibrary.model.js")(sequelize, Sequelize);
db.statistics= require("../models/statistics.model.js")(sequelize, Sequelize);
db.institutions= require("../models/institutions.model.js")(sequelize, Sequelize);
db.studentBook= require("../models/studentBook.model.js")(sequelize, Sequelize);
db.roleClaim= require("../models/roleClaim.model.js")(sequelize, Sequelize);
db.userClaim= require("../models/userClaim.model.js")(sequelize, Sequelize);
db.permissionClaims = require("./permissionClaims.model.js")(sequelize, Sequelize);
db.exam = require("../models/exam.model.js")(sequelize, Sequelize);

/*Veza 1-1*/
db.users.hasMany(db.statistics)
db.statistics.belongsTo(db.users)

db.institutions.hasMany(db.library)
db.library.belongsTo(db.institutions)

db.roles.hasMany(db.users, {foreignKey: 'roleFK', sourceKey: 'id'});
db.users.belongsTo(db.roles, {foreignKey: 'roleFK', targetKey: 'id'});

db.studies.hasMany(db.users, {foreignKey: 'studiesFK', sourceKey: 'id'});
db.users.belongsTo(db.studies, {foreignKey: 'studiesFK', targetKey: 'id'});

db.roles.hasMany(db.roleClaim, {foreignKey: 'roleFK', sourceKey: 'id'});
db.roleClaim.belongsTo(db.roles, {foreignKey: 'roleFK', targetKey: 'id'});

db.users.hasMany(db.userClaim, {foreignKey: 'userFK', sourceKey: 'id'});
db.userClaim.belongsTo(db.users, {foreignKey: 'userFK', targetKey: 'id'});

db.permissionClaims.hasMany(db.userClaim, {foreignKey: 'permissionClaimFK', sourceKey: 'id'});
db.userClaim.belongsTo(db.permissionClaims, {foreignKey: 'permissionClaimFK', targetKey: 'id'});

db.permissionClaims.hasMany(db.roleClaim, {foreignKey: 'permissionClaimFK', sourceKey: 'id'});
db.roleClaim.belongsTo(db.permissionClaims, {foreignKey: 'permissionClaimFK', targetKey: 'id'});

db.institutions.hasMany(db.users, {foreignKey: 'institutionFK', sourceKey: 'id'});
db.users.belongsTo(db.institutions, {foreignKey: 'institutionFK', targetKey: 'id'});

db.studies.hasMany(db.courses, {foreignKey: 'studyFK', sourceKey: 'id'});
db.courses.belongsTo(db.studies, {foreignKey: 'studyFK', targetKey: 'id'});

db.users.hasMany(db.courses, {foreignKey: 'userFK', sourceKey: 'id'});
db.courses.belongsTo(db.users, {foreignKey: 'userFK', targetKey: 'id'});

db.courses.hasMany(db.terms, {foreignKey: 'courseFK', sourceKey: 'id'});
db.terms.belongsTo(db.courses, {foreignKey: 'courseFK', targetKey: 'id'});

db.classrooms.hasMany(db.terms, {foreignKey: 'classroomFK', sourceKey: 'id'});
db.terms.belongsTo(db.classrooms, {foreignKey: 'classroomFK', targetKey: 'id'});

db.classrooms.hasMany(db.records, {foreignKey: 'classroomFK', sourceKey: 'id'});
db.records.belongsTo(db.classrooms, {foreignKey: 'classroomFK', targetKey: 'id'});

db.users.hasMany(db.records, {foreignKey: 'userFK', sourceKey: 'id'});
db.records.belongsTo(db.users, {foreignKey: 'userFK', targetKey: 'id'});

db.institutions.hasMany(db.classrooms, {foreignKey: 'institutionFK', sourceKey: 'id'});
db.classrooms.belongsTo(db.institutions, {foreignKey: 'institutionFK', targetKey: 'id'});

db.institutions.hasMany(db.studies, {foreignKey: 'institutionFK', sourceKey: 'id'});
db.studies.belongsTo(db.institutions, {foreignKey: 'institutionFK', targetKey: 'id'});

db.library.hasMany(db.booksLibrary, {foreignKey: 'libraryFK', sourceKey: 'id'});
db.booksLibrary.belongsTo(db.library, {foreignKey: 'libraryFK', targetKey: 'id'});

db.books.hasMany(db.booksLibrary, {foreignKey: 'bookFK', sourceKey: 'id'});
db.booksLibrary.belongsTo(db.books, {foreignKey: 'bookFK', targetKey: 'id'});

db.categories.hasMany(db.books, {foreignKey: 'categoryFK', sourceKey: 'id'});
db.books.belongsTo(db.categories, {foreignKey: 'categoryFK', targetKey: 'id'});

db.users.hasMany(db.studentBook, {foreignKey: 'userFK', sourceKey: 'id'});
db.studentBook.belongsTo(db.users, {foreignKey: 'userFK', targetKey: 'id'});

db.books.hasMany(db.studentBook, {foreignKey: 'bookFK', sourceKey: 'id'});
db.studentBook.belongsTo(db.books, {foreignKey: 'bookFK', targetKey: 'id'});

db.courses.hasMany(db.exam, {foreignKey: 'courseFK', sourceKey: 'id'});
db.exam.belongsTo(db.courses, {foreignKey: 'courseFK', targetKey: 'id'});

db.classrooms.hasMany(db.exam, {foreignKey: 'classroomFK', sourceKey: 'id'});
db.exam.belongsTo(db.classrooms, {foreignKey: 'classroomFK', targetKey: 'id'});


module.exports = db;