const db = require("../models");
const config = require("../config/auth.config");
const Statistika = db.statistika;
const Korisnik = db.korisnik;

const Op = db.Sequelize.Op;

exports.createStatistics = (req, res) => {
    if (!req.body.prisutnost && !req.body.korisnikId) {
        res.status(400).send({
            message: "Sva polja su obavezna!",
        });
        return;
    }
    if (req.params.id) {
        Statistika.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        }).then((statistika) => {
            statistika.update({
                prisutnost: req.body.prisutnost,
            });
            if (req.body.korisnikId) {
                Korisnik.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.korisnikId,
                        },
                    },
                })
                    .then((korisnikId) => {
                        statistika.setKorisnik(korisnikId).then(() => {
                            res.status(200).send({
                                message: "Statistika uspješno uređena.",
                            });
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(500).send({ message: "Korisnik nije poslan" });
            }
        });
    } else {
        Statistika.create({
            prisutnost: req.body.prisutnost,
        }).then((statistika) => {
            if (req.body.korisnikId) {
                Korisnik.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.korisnikId,
                        },
                    },
                })
                    .then((korisnikId) => {
                        statistika.setKorisnik(korisnikId).then(() => {
                            res.status(200).send({
                                message: "Statistika uspješno unesena.",
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

exports.getStatistics = (req, res) => {
    Statistika.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Greška prilikom dohvata.",
            });
        });
};
