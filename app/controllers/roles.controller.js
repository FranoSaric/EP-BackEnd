const db = require("../models");
const config = require("../config/auth.config");
const Roles = db.roles;

const Op = db.Sequelize.Op;

exports.createRole = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Role name is required!",
        });
        return;
    }
    if (req.body.id) {
        Roles.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((roles) => {
            roles
                .update({
                    name: req.body.name,
                })
                .then(() => {
                    res.status(200).send({
                        status: 101,
                        message: "Role successfully edited.",
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Error editing role.",
                    });
                });
        });
    } else {
        Roles.create({
            name: req.body.name,
        })
            .then(() => {
                res.status(200).send({
                    status: 101,
                    message: "Role successfully entered.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Error creating role.",
                });
            });
    }
};

exports.getRoles = (req, res) => {
    Roles.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteRole = (req, res) => {
    Roles.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Role successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Role cannot be deleted.",
            });
        });
};