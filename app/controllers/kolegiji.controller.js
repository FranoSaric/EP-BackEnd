const db = require("../models");
const config = require("../config/auth.config");
const Kolegij = db.kolegiji;
const Studiji = db.studiji;
const Korisnik = db.korisnik;

const Op = db.Sequelize.Op;

//Kreira kolegij, potrebno preurediti da kreira kolegij za pojedini studij/ustanovu

exports.createCollege = (req, res) => {
  if (
    !req.body.naziv &&
    !req.body.akGod &&
    !req.body.semestar &&
    !req.body.osobljeFK &&
    !req.body.studijiFK
  ) {
    res.status(400).send({
      message: "Sva polja su obavezna!",
    });
    return;
  }
  if (req.params.id) {
    Kolegij.findOne({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    })
      .then((kolegij) => {
        kolegij.update({
          naziv: req.body.naziv,
          akGod: req.body.akGod,
          semestar: req.body.semestar,
        });
        if (req.body.osobljeFK) {
          Korisnik.findOne({
            where: {
              id: {
                [Op.eq]: req.body.osobljeFK,
              },
            },
          }).then((osobljeFK) => {
            kolegij.setKorisnik(osobljeFK).then(() => {
              if (req.body.studijiFK) {
                Studiji.findOne({
                  where: {
                    id: {
                      [Op.eq]: req.body.studijiFK,
                    },
                  },
                }).then((studijiFK) => {
                  kolegij.setStudiji(studijiFK).then(() => {
                    res.status(200).send({
                      message: "Kolegij uspješno uređen.",
                    });
                  });
                });
              } else {
                res.status(500).send({ message: "Studij nije poslan" });
              }
            });
          });
        } else {
          res.status(500).send({ message: "Osoblje nije poslano" });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    Kolegij.create({
      naziv: req.body.naziv,
      akGod: req.body.akGod,
      semestar: req.body.semestar,
    })
      .then((kolegij) => {
        if (req.body.osobljeFK) {
          Korisnik.findOne({
            where: {
              id: {
                [Op.eq]: req.body.osobljeFK,
              },
            },
          }).then((osobljeFK) => {
            kolegij.setKorisnik(osobljeFK).then(() => {
              if (req.body.studijiFK) {
                Studiji.findOne({
                  where: {
                    id: {
                      [Op.eq]: req.body.studijiFK,
                    },
                  },
                }).then((studijiFK) => {
                  kolegij.setStudiji(studijiFK).then(() => {
                    res.status(200).send({
                      message: "Kolegij uspješno unesen.",
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
//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji
exports.getColleges = (req, res) => {
  Kolegij.findAll({
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
