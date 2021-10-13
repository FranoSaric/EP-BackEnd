const db = require("../models");
const config = require("../config/auth.config");
const Evidencija = db.evidencija;
const Ucionica = db.ucionica;
const Korisnik = db.korisnik;

const Op = db.Sequelize.Op;

exports.createRecord = (req, res) => {
    if (!req.body.osobaFK && !req.body.ucionicaFK) {
        res.status(400).send({
            message: "Sva polja su obavezna!",
        });
        return;
    }
    if (req.params.id) {
        Evidencija.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        })
            .then((evidencija) => {
                evidencija.update({datumKreiranja: req.body.datumKreiranja});
                if (req.body.osobaFK) {
                    Korisnik.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.osobaFK,
                            },
                        },
                    }).then((osobaFK) => {
                        evidencija.setKorisnik(osobaFK).then(() => {
                            if (req.body.ucionicaFK) {
                                Ucionica.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.ucionicaFK,
                                        },
                                    },
                                }).then((ucionicaFK) => {
                                    evidencija
                                        .setUcionica(ucionicaFK)
                                        .then(() => {
                                            res.status(200).send({
                                                message:
                                                    "Evidencija uspješno uređena.",
                                            });
                                        });
                                });
                            } else {
                                res.status(500).send({
                                    message: "Učionica nije poslana",
                                });
                            }
                        });
                    });
                } else {
                    res.status(500).send({ message: "Osoba nije poslana" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } else {
        Evidencija.create({ datumKreiranja: req.body.datumKreiranja })
            .then((evidencija) => {
                if (req.body.osobaFK) {
                    Korisnik.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.osobaFK,
                            },
                        },
                    }).then((osobaFK) => {
                        evidencija.setKorisnik(osobaFK).then(() => {
                            if (req.body.ucionicaFK) {
                                Ucionica.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.ucionicaFK,
                                        },
                                    },
                                })
                                    .then((ucionicaFK) => {
                                        evidencija
                                            .setUcionica(ucionicaFK)
                                            .then(() => {
                                                res.status(200).send({
                                                    message:
                                                        "Evidencija uspješno unesena.",
                                                });
                                            });
                                    })
                                    .catch((err) => {
                                        res.status(500).send({
                                            message: err.message,
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
exports.getRecords = (req, res) => {
    Evidencija.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Greška prilikom dohvata.",
            });
        });
};
