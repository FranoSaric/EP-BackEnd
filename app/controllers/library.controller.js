const db = require("../models");
const config = require("../config/auth.config");
const Library = db.library;
const Institutions = db.institutions;

const Op = db.Sequelize.Op;

exports.createLibrary = (req, res) => {
    if (!req.body.name || !req.body.institutionId) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Library.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        })
            .then((library) => {
                library.update({ name: req.body.name });
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
        Library.create({ name: req.body.name }).then((library) => {
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
    if (req.body.institutionId) {
        console.log("mozda ovdje")
        Library.findAll({
            include: [
                {
                    model: Institutions,
                },
            ],
            where: {
                institutionId: req.body.institutionId,
            },
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Retrieval error.",
                });
            });
    }else{
        console.log("tu sam")
        Library.findAll({
            include: [
                {
                    model: Institutions,
                },
            ]
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Retrieval error.",
                });
            });
    }
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
