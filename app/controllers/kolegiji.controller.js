const db = require("../models");
const config = require("../config/auth.config");
const Kolegij = db.kolegiji;
const Studiji = db.studiji;
const Korisnik = db.korisnik;

const Op = db.Sequelize.Op;

//Kreira kolegij, potrebno preurediti da kreira kolegij za pojedini studij/ustanovu

exports.createkolegiji = (req, res) => {
  if (!req.body.naziv && !req.body.akGod && !req.body.semestar && !req.body.osobljeFK && !req.body.studijiFK) {
    res.status(400).send({
      message: "Sva polja su obavezna!"
    });
    return;
  }
  Kolegij.create({
    naziv: req.body.naziv,
    akGod: req.body.akGod,
    semestar: req.body.semestar
  })
    .then(kolegiji => {
      if (req.body.osobljeFK) {
        Korisnik.findOne({
          where: {
            id: {
              [Op.eq]: req.body.osobljeFK
            }
          }
        }).then(osobljeFK => {
          kolegiji.setKorisnik(osobljeFK).then(() => {
            if (req.body.studijiFK) {
              Studiji.findOne({
                where: {
                  id: {
                    [Op.eq]: req.body.studijiFK
                  }
                }
              }).then(studijiFK => {
                kolegiji.setStudiji(studijiFK).then(() => {
                  res.status(200).send({
                    message: "Kolegij uspješno unesen."
                  });
                });
              });
            }
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji
exports.findAll = (req, res) => {
  Kolegij.findAll({
    where: {},
    include: [{
      model: Korisnik,
      where: { brojIndexa: req.params.id }
    }]
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Greška prilikom dohvata."
    });
  });
};