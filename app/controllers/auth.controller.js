const db = require("../models");
const config = require("../config/auth.config");
const Korisnik = db.korisnik;
const Evidencija = db.evidencija;
const Ucionica = db.ucionica;
const Termini = db.termini;
const Uloga = db.uloga;
const Ustanova = db.ustanova;
const Op = db.Sequelize.Op;
const { Sequelize } = require('sequelize');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

 exports.signUp = (req, res) => {
  if (!req.body.username && !req.body.brojIndexa && !req.body.ime && !req.body.prezime && !req.body.email && !req.body.lozinka && !req.body.datumKreiranja && !req.body.ulogaFK && !req.body.ustanovaFK) {
    res.status(400).send({
      message: "Sadržaj ne smije biti prazan!"
    });
    return;
  }
  Korisnik.findOne({
    where: {
      brojIndexa: {
        [Op.eq]: req.body.brojIndexa
      }
    }
  }).then(korisnik => {
    // Check if record exists in db
    if (korisnik) {
      var token = jwt.sign({ id: korisnik.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      console.log(token);
      korisnik.update({
        brojIndexa: req.body.brojIndexa,
        username: req.body.username,
        ime: req.body.ime,
        prezime: req.body.prezime,
        email: req.body.email,
        lozinka: bcrypt.hashSync(req.body.lozinka, 8),
        datumKreiranja: new Date()
      }).then(korisnik => {
        if (req.body.ulogaFK) {
          Uloga.findOne({
            where: {
              naziv: {
                [Op.eq]: req.body.ulogaFK
              }
            }
          }).then(id => {
            korisnik.setUloga(id);
          });
        }else {
          // user role = 1
          korisnik.setUloga(1);
        } 
      }).then(()=>{
          res.send({ message: "Uspjesan update!", accessToken: token });
      });
    }else{
      Korisnik.create({
        brojIndexa: req.body.brojIndexa,
        username: req.body.username,
        ime: req.body.ime,
        prezime: req.body.prezime,
        email: req.body.email,
        lozinka: bcrypt.hashSync(req.body.lozinka, 8),
        datumKreiranja: req.body.datumKreiranja,
      }).then(korisnik => {
        var token = jwt.sign({ id: korisnik.brojIndexa }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        if (req.body.ustanovaFK) {
          Ustanova.findOne({
            where: {
              id: {
                [Op.eq]: req.body.ustanovaFK
              }
            }
          }).then(id => {
            korisnik.setUstanova(id);
          })
        }
        if (req.body.ulogaFK) {
          Uloga.findOne({
            where: {
              id: {
                [Op.eq]: req.body.ulogaFK
              }
            }
          }).then(id => {
            korisnik.setUloga(id);
          });
        } else {
          // user role = 1
          korisnik.setUloga(1).then(() => {
            res.send({ message: "Profesor uspješno registriran!", accessToken: token });
          });
        }
      }).then(()=>{
        res.send({ message: "Korisnik uspješno kreiran!", accessToken: token });
    })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    }
  })
  
}; 
//TODO("Napraviti signin preko sso za sum API")
exports.signIn = (req, res) => {
  Korisnik.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(korisnik => {
      if (!korisnik) {
        return res.status(404).send({ message: "Korisnik nije pronađen." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.lozinka,
        korisnik.lozinka
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Pogrešna lozinka!"
        });
      }
      var token = jwt.sign({ id: korisnik.brojIndexa }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      console.log("token",token)
        korisnik.getUloga().then(roles => {
          res.status(200).send({
            brojIndexa: korisnik.brojIndexa,
            username:korisnik.username,
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            email: korisnik.email,
            roles: roles.naziv,
            accessToken: token
          });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
//TODO("ispis svih korisnika za evidenciju")
exports.findUser = (req, res) => {
  Korisnik.findAll({
    include: [{
      model: Evidencija,
      include: [{
        model: Ucionica,
        include: [{
          model: Termini,
           where: {
            id : req.params.id
          } 
      }]
    }], where: [{
      id :  {[Op.ne]: null},
      createdAt: {
        [Op.between]: [req.params.startTime, req.params.endTime]
      },
      updatedAt: {
        [Op.between]: [req.params.startTime, req.params.endTime]
      }
    }]
  }]
  }).then(data=> {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Greška prilikom dohvata."
      });
    });
};

exports.getUsers = (req, res) => {
  Korisnik.findAll({
  }).then(data=> {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Greška prilikom dohvata."
      });
    });
};