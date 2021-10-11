const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Korisnik = db.korisnik;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.brojIndexa = decoded.id;
    next();
  });
};

isDjelatnik = (req, res, next) => {
  Korisnik.findByPk(req.brojIndexa).then(korisnik => {
    korisnik.getUloga().then(uloga => {
      
        if (uloga.naziv === "djelatnik") {
          next();
          return;
        }
      

      res.status(403).send({
        message: "Potrebna djelatnik uloga!"
      });
      return;
    });
  });
};

isStudent = (req, res, next) => {
  Korisnik.findByPk(req.brojIndexa).then(korisnik => {
    korisnik.getUloga().then(uloga => {
      
        if (uloga.naziv === "student") {
          next();
          return;
        }
      

      res.status(403).send({
        message: "Potrebna student uloga!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isDjelatnik: isDjelatnik,
  isStudent: isStudent
};
module.exports = authJwt;