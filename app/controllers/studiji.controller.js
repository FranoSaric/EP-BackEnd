const db = require("../models");
const config = require("../config/auth.config");
const Studiji = db.studiji;
const Ustanova = db.ustanova;

const Op = db.Sequelize.Op;

exports.createStudy = (req, res) => {
  if (
    !req.body.naziv &&
    !req.body.godina &&
    !req.body.ciklus &&
    !req.body.ustanovaFK
  ) {
    res.status(400).send({
      message: "Sva polja su obavezna!",
    });
    return;
  }
  if (req.params.id) {
    Studiji.findOne({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    }).then((studiji) => {
      studiji.update({
        naziv: req.body.naziv,
        godina: req.body.godina,
        ciklus: req.body.ciklus,
      });
      if (req.body.ustanovaFK) {
        Ustanova.findOne({
          where: {
            id: {
              [Op.eq]: req.body.ustanovaFK,
            },
          },
        })
          .then((ustanovaFK) => {
            studiji.setUstanova(ustanovaFK).then(() => {
              res.status(200).send({
                message: "Studij uspješno uređen.",
              });
            });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }else{
        res.status(500).send({ message: "Ustanova nije poslana" });
      }
    });
  } else {
    Studiji.create({
      naziv: req.body.naziv,
      godina: req.body.godina,
      ciklus: req.body.ciklus,
    }).then((studiji) => {
      if (req.body.ustanovaFK) {
        Ustanova.findOne({
          where: {
            id: {
              [Op.eq]: req.body.ustanovaFK,
            },
          },
        })
          .then((ustanovaFK) => {
            studiji.setUstanova(ustanovaFK).then(() => {
              res.status(200).send({
                message: "Studij uspješno unesen.",
              });
            });
          })
          .catch((err) => {
            res.status(500).send({  message: "Greška prilikom kreiranja studija.", });
          })
      }else{
        res.status(500).send({ message: "Ustanova nije poslana" });
      }
    });
  }
};

//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji

exports.getStudies = (req, res) => {
  Studiji.findAll({
    where: {},
    include: [
      {
        model: Korisnik,
        where: { brojIndexa: req.params.id },
      },
    ],
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
