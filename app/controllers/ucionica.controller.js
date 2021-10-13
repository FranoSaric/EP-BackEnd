const db = require("../models");
const config = require("../config/auth.config");
const Ucionica = db.ucionica;
const Ustanova = db.ustanova;

const Op = db.Sequelize.Op;

exports.getClassrooms = (req, res) => {
  if (
    !req.body.brojucionice &&
    !req.body.brojmjesta &&
    !req.body.kat &&
    !req.body.slobodna
  ) {
    res.status(400).send({
      message: "Sva polja su obavezna!",
    });
    return;
  }
  if (req.params.id) {
    Ucionica.findOne({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    }).then((ucionica) => {
      ucionica.update({
        brojucionice: req.body.brojucionice,
        brojmjesta: req.body.brojmjesta,
        kat: req.body.kat,
        slobodna: req.body.slobodna,
      });
      if (req.body.ustanovaFK) {
        Ustanova.findOne({
          where: {
            id: {
              [Op.eq]: req.body.ustanovaFK,
            },
          },
        })
          .then(() => {
            res.status(200).send({
              message: "Učionica uspješno uređena.",
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Greška prilikom uređivanja učionice.",
            });
          });
      }
    });
  } else {
    Ucionica.create({
      brojucionice: req.body.brojucionice,
      brojmjesta: req.body.brojmjesta,
      kat: req.body.kat,
      slobodna: req.body.slobodna,
    }).then((ucionica) => {
      if (req.body.ustanovaFK) {
        Ustanova.findOne({
          where: {
            id: {
              [Op.eq]: req.body.ustanovaFK,
            },
          },
        })
          .then((ustanovaFK) => {
            ucionica.setUstanova(ustanovaFK).then(() => {
              res.status(200).send({
                message: "Učionica uspješno unesena.",
              });
            });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    });
  }
};

exports.createClassroom = (req, res) => {
  Ucionica.findAll({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Greška prilikom dohvata.",
      });
    });
};
