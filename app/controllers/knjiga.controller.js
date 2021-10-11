const db = require("../models");
const config = require("../config/auth.config");
const Knjiga = db.knjiga;
const Kategorija = db.kategorija;

const Op = db.Sequelize.Op;

exports.createknjiga = (req, res) => {
    if (!req.body.barcode && !req.body.naziv && !req.body.autor && !req.body.kategorijaFK) {
      res.status(400).send({
        message: "Sva polja su obavezna!"
      });
      return;
    }
    Knjiga.create({
      barcode: req.body.barcode,
      naziv: req.body.naziv,
      autor: req.body.autor
    })
    .then(knjiga => {
        if (req.body.kategorijaFK) {
          Kategorija.findOne({
            where: {
              id: {
                [Op.eq]: req.body.kategorijaFK
              }
            }
          }).then(kategorijaFK => {
            knjiga.setKategorija(kategorijaFK).then(() => {
                res.status(200).send({
                    message: "Knjiga uspješno unesena."
                  });
          });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
      };
    });
};
  
  //Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji
  
  exports.findAll = (req, res) => {
    Knjiga.findAll({
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