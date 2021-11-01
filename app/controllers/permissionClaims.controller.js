const db = require("../models");
const config = require("../config/auth.config");
const PermissionClaims = db.permissionClaims;

const Op = db.Sequelize.Op;

exports.createPermissionClaim = (req, res) => {
    console.log(req.body)
    if (!req.body.type || !req.body.value) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        PermissionClaims.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((permissionClaims) => {
            permissionClaims
                .update({
                    type: req.body.type,
                    value: req.body.value
                })
                .then(() => {
                    res.status(200).send({
                        status: 101,
                        message: "Permission claim successfully edited.",
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Error editing permission claim.",
                    });
                });
        });
    } else {
        PermissionClaims.create({
            type: req.body.type,
            value: req.body.value
        })
            .then(() => {
                res.status(200).send({
                    status: 101,
                    message: "Permission claim successfully entered.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Error creating permission claim.",
                });
            });
    }
};

exports.getPermissionClaims = (req, res) => {
    PermissionClaims.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deletePermissionClaim = (req, res) => {
    PermissionClaims.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Permission claim successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Permission claim cannot be deleted.",
            });
        });
};