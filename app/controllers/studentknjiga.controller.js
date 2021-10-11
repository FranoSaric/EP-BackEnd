const db = require("../models");
const config = require("../config/auth.config");
const StudentKnjiga = db.studentKnjiga;
const Knjiga = db.knjiga;
const Korisnik = db.korisnik

const Op = db.Sequelize.Op;

exports.createstudentKnjiga = (req, res) => {
    if (!req.body.datumPodizanja && !req.body.datumPovratka && !req.body.osobaFK && !req.body.knjigaFK) {
      res.status(400).send({
        message: "Sva polja su obavezna!"
      });
      return;
    }
    StudentKnjiga.create({
      datumPodizanja: req.body.datumPodizanja,
      datumPovratka: req.body.datumPovratka,
    })
    .then(studentKnjiga => {
        if (req.body.osobaFK) {
          Korisnik.findOne({
            where: {
              id: {
                [Op.eq]: req.body.osobaFK
              }
            }
          }).then(osobaFK => {
            studentKnjiga.setKorisnik(osobaFK).then(() => {
                if (req.body.knjigaFK) {
                    Knjiga.findOne({
                        where: {
                        id: {
                            [Op.eq]: req.body.knjigaFK
                        }
                        }
                    }).then(knjigaFK => {
                        studentKnjiga.setKnjiga(knjigaFK).then(() => {
                        res.status(200).send({
                            message: "Student-knjiga uspješno unesen."
                        });
                        });
                    });
                }
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
    StudentKnjiga.findAll({
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