module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "Sarke.007",
  DB: "sum",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    useUTC: false, // for reading from database
  },
};
