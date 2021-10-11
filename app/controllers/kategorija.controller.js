const db = require("../models");
const config = require("../config/auth.config");
const Kategorija = db.kategorija;

const Op = db.Sequelize.Op;

exports.createkategorija = (req, res) => {
  if (!req.body.naziv) {
    res.status(400).send({
      message: "Naziv kategorije je potreban!"
    });
    return;
  }
    Kategorija.create({
    naziv: req.body.naziv
    }).then(() => {
        res.status(200).send({
            message: "Kategorija uspješno unesena."
          });
      }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Greška prilikom kreiranja kategorije."
        });
      });
  };

  exports.findAll = (req, res) => {
    Kategorija.findAll({}).then(data=> {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Greška prilikom dohvata."
        });
      });
  };