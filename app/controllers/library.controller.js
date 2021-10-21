const db = require("../models");
const config = require("../config/auth.config");
const Library = db.library;
const Institutions = db.institutions;

const Op = db.Sequelize.Op;

exports.createLibrary = (req, res) => {
    if (!req.body.institutionId) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.params.id) {
        Library.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        })
            .then((library) => {
                library.update({});
                if (req.body.institutionId) {
                    Institutions.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.institutionId,
                            },
                        },
                    })
                        .then((institutionId) => {
                            library.setInstitution(institutionId).then(() => {
                                res.status(200).send({
                                    status: 101,
                                    message: "Library successfully edited.",
                                });
                            });
                        })
                        .catch((err) => {
                            res.status(500).send({ message: err.message });
                        });
                } else {
                    res.status(500).send({ message: err.message });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Institution not sent." });
            });
    } else {
        Library.create({}).then((library) => {
            if (req.body.institutionId) {
                Institutions.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.institutionId,
                        },
                    },
                })
                    .then((institutionId) => {
                        library.setInstitution(institutionId).then(() => {
                            res.status(200).send({
                                status: 101,
                                message: "Library successfully entered.",
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

exports.getLibraries = (req, res) => {
    Library.findAll({
        include: [
            {
                model: Institutions,
            },
        ],
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteLibrary = (req, res) => {
    Library.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Library successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Library cannot be deleted.",
            });
        });
};
