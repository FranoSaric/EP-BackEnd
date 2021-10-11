const db = require("../models");
const config = require("../config/auth.config");
const Knjiznica = db.knjiznica;
const Ustanova = db.ustanova;

const Op = db.Sequelize.Op;

exports.createknjiznica = (req, res) => {
  if (!req.body.ustanovaId) {
    res.status(400).send({
      message: "Polje ustanove je obavezno!"
    });
    return;
  }
    Knjiznica.create()
    .then(knjiznica => {
        if (req.body.ustanovaId) {
            Ustanova.findOne({
            where: {
                id: {
                [Op.eq]: req.body.ustanovaId
                }
            }
            }).then(ustanovaId => {
                knjiznica.setUstanova(ustanovaId).then(() => {
                res.status(200).send({
                    message: "Knjiznica uspješno unesena."
                    });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
        };
    });
  };

  exports.findAll = (req, res) => {
    Knjiznica.findAll({}).then(data=> {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Greška prilikom dohvata."
        });
      });
  };