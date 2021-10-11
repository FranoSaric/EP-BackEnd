const db = require("../models");
const config = require("../config/auth.config");
const Ustanova = db.ustanova;

const Op = db.Sequelize.Op;

exports.createustanova = (req, res) => {
  if (!req.body.naziv && !req.body.adresa && !req.body.ziroracun && !req.body.kontakt) {
    res.status(400).send({
      message: "Sva polja su potrebna!"
    });
    return;
  }
    Ustanova.create({
    naziv: req.body.naziv,
    adresa: req.body.adresa,
    ziroracun: req.body.ziroracun,
    kontakt: req.body.kontakt,
    }).then(() => {
        res.status(200).send({
            message: "Ustanova uspješno unesena."
          });
      }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Greška prilikom kreiranja kategorije."
        });
      });
  };

  exports.findAll = (req, res) => {
    Ustanova.findAll({}).then(data=> {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Greška prilikom dohvata."
        });
      });
  };