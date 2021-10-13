const db = require("../models");
const config = require("../config/auth.config");
const Knjiga = db.knjiga;
const Kategorija = db.kategorija;

const Op = db.Sequelize.Op;

exports.createBook = (req, res) => {
    if (
        !req.body.barcode &&
        !req.body.naziv &&
        !req.body.autor &&
        !req.body.kategorijaFK
    ) {
        res.status(400).send({
            message: "Sva polja su obavezna!",
        });
        return;
    }
    if (req.params.id) {
        Knjiga.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        }).then((knjiga) => {
            knjiga.update({
                barcode: req.body.barcode,
                naziv: req.body.naziv,
                autor: req.body.autor,
            });
            if (req.body.kategorijaFK) {
                Kategorija.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.kategorijaFK,
                        },
                    },
                })
                    .then((kategorijaFK) => {
                        knjiga.setKategorija(kategorijaFK).then(() => {
                            res.status(200).send({
                                message: "Knjiga uspješno uređena.",
                            });
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(500).send({ message: "Kategorija nije poslana" });
            }
        });
    } else {
        Knjiga.create({
            barcode: req.body.barcode,
            naziv: req.body.naziv,
            autor: req.body.autor,
        }).then((knjiga) => {
            if (req.body.kategorijaFK) {
                Kategorija.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.kategorijaFK,
                        },
                    },
                })
                    .then((kategorijaFK) => {
                        knjiga.setKategorija(kategorijaFK).then(() => {
                            res.status(200).send({
                                message: "Knjiga uspješno unesena.",
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

//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji

exports.getBooks = (req, res) => {
    Knjiga.findAll({
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
