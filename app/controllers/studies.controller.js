const db = require("../models");
const config = require("../config/auth.config");
const Studies = db.studies;
const Institutions = db.institutions;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.createStudy = (req, res) => {
    if (
        !req.body.name ||
        !req.body.year ||
        !req.body.cycle ||
        !req.body.institutionFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Studies.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((studies) => {
            studies.update({
                name: req.body.name,
                year: req.body.year,
                cycle: req.body.cycle,
            });
            if (req.body.institutionFK) {
                Institutions.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.institutionFK,
                        },
                    },
                })
                    .then((institutionFK) => {
                        studies.setInstitution(institutionFK).then(() => {
                            res.status(200).send({
                                status: 101,
                                message: "Study successfully edited.",
                            });
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(500).send({
                    message: "The institution was not sent",
                });
            }
        });
    } else {
        Studies.create({
            name: req.body.name,
            year: req.body.year,
            cycle: req.body.cycle,
        }).then((studies) => {
            if (req.body.institutionFK) {
                Institutions.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.institutionFK,
                        },
                    },
                })
                    .then((institutionFK) => {
                        studies.setInstitution(institutionFK).then(() => {
                            res.status(200).send({
                                status: 101,
                                message: "Study successfully entered.",
                            });
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: "Error creating study.",
                        });
                    });
            } else {
                res.status(500).send({
                    message: "The institution was not sent",
                });
            }
        });
    }
};

//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji

exports.getStudies = (req, res) => {
    Studies.findAll({
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

exports.deleteStudy = (req, res) => {
    Studies.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Study successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Study cannot be deleted.",
            });
        });
};
