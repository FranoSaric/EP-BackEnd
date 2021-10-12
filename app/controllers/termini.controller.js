const db = require("../models");
const config = require("../config/auth.config");
const Termini = db.termini;
const Ucionica = db.ucionica;
const Kolegiji = db.kolegiji;

const Op = db.Sequelize.Op;

exports.createtermini = (req, res) => {
  if (
    !req.body.datum &&
    !req.body.startTime &&
    !req.body.endTime &&
    !req.body.endTime &&
    !req.body.trajanje &&
    !req.body.kolegijiFK &&
    !req.body.ucionicaFK
  ) {
    res.status(400).send({
      message: "Sva polja su obavezna!",
    });
    return;
  }
  if (req.params.id) {
    Termini.findOne({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    })
      .then((termini) => {
        termini.update({
          datum: req.body.datum,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          trajanje: req.body.trajanje,
        });
        if (req.body.kolegijiFK) {
          Kolegiji.findOne({
            where: {
              id: {
                [Op.eq]: req.body.kolegijiFK,
              },
            },
          }).then((kolegijiFK) => {
            termini.setKolegiji(kolegijiFK).then(() => {
              if (req.body.ucionicaFK) {
                Ucionica.findOne({
                  where: {
                    id: {
                      [Op.eq]: req.body.ucionicaFK,
                    },
                  },
                }).then((ucionicaFK) => {
                  termini.setUcionica(ucionicaFK).then(() => {
                    res.status(200).send({
                      message: "Termin uspješno uređen.",
                    });
                  });
                });
              }else{
                res.status(500).send({ message: "Učionica nije poslana" });
              }
            });
          });
        }else{
          res.status(500).send({ message: "Kolegij nije poslan" });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    Termini.create({
      datum: req.body.datum,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      trajanje: req.body.trajanje,
    })
      .then((termini) => {
        if (req.body.kolegijiFK) {
          Kolegiji.findOne({
            where: {
              id: {
                [Op.eq]: req.body.kolegijiFK,
              },
            },
          }).then((kolegijiFK) => {
            termini.setKolegiji(kolegijiFK).then(() => {
              if (req.body.ucionicaFK) {
                Ucionica.findOne({
                  where: {
                    id: {
                      [Op.eq]: req.body.ucionicaFK,
                    },
                  },
                }).then((ucionicaFK) => {
                  termini.setUcionica(ucionicaFK).then(() => {
                    res.status(200).send({
                      message: "Termin uspješno unesen.",
                    });
                  });
                });
              }
            });
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.findAll = (req, res) => {
  Termini.findAll({
    include: [
      {
        model: Kolegiji,
      },
    ] /* ,
      where: {
        kolegijiFK : req.params.id
      }  */,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Greška prilikom dohvata.",
      });
    });
};
