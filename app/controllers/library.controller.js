const db = require("../models");
const config = require("../config/auth.config");
const Library = db.library;
const Institutions = db.institutions;

const Op = db.Sequelize.Op;

exports.createLibrary = (req, res) => {
    if (!req.body.institutionFK) {
        res.status(400).send({
            message: "The field of the institution is mandatory!",
        });
        return;
    }

    Library.create().then((library) => {
        if (req.body.institutionFK) {
            Institutions.findOne({
                where: {
                    id: {
                        [Op.eq]: req.body.institutionFK,
                    },
                },
            })
                .then((institutionFK) => {
                    library.setInstitution(institutionFK).then(() => {
                        res.status(200).send({
                            message: "Library successfully entered.",
                        });
                    });
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message });
                });
        }
    });
};

exports.getLibraries = (req, res) => {
    Library.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};
