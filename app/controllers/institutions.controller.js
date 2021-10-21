const db = require("../models");
const config = require("../config/auth.config");
const Institutions = db.institutions;

const Op = db.Sequelize.Op;

exports.createInstitution = (req, res) => {
    if (
        !req.body.name ||
        !req.body.address ||
        !req.body.giroAccount ||
        !req.body.contact
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Institutions.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((institutions) => {
            institutions
                .update({
                    name: req.body.name,
                    address: req.body.address,
                    giroAccount: req.body.giroAccount,
                    contact: req.body.contact,
                })
                .then(() => {
                    res.status(200).send({
                        message: "Institution successfully arranged.",
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Error editing institutions.",
                    });
                });
        });
    } else {
        Institutions.create({
            name: req.body.name,
            address: req.body.address,
            giroAccount: req.body.giroAccount,
            contact: req.body.contact,
        })
            .then(() => {
                res.status(200).send({
                    message: "Institution successfully entered.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Error creating institution.",
                });
            });
    }
};

exports.getInstitutions = (req, res) => {
    Institutions.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteInstitution = (req, res) => {
    Institutions.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                message: "Institution successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Institution cannot be deleted.",
            });
        });
};
