const db = require("../models");
const config = require("../config/auth.config");
const RoleClaim = db.roleClaim;
const Roles = db.roles;

const Op = db.Sequelize.Op;

exports.createRoleClaim = (req, res) => {
    if (
        !req.body.claimType ||
        !req.body.claimValue||
        !req.body.roleFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        RoleClaim.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((roleClaim) => {
            roleClaim.update({
                claimType: req.body.claimType,
                claimValue: req.body.claimValue
            });
            if (req.body.roleFK) {
                Roles.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.roleFK,
                        },
                    },
                })
                    .then(() => {
                        res.status(200).send({
                            message: "Role claim successfully edited.",
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "Error editing role claim.",
                        });
                    });
            }
        });
    } else {
        RoleClaim.create({
            claimType: req.body.claimType,
                claimValue: req.body.claimValue
        }).then((roleClaim) => {
            if (req.body.roleFK) {
                Roles.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.roleFK,
                        },
                    },
                })
                    .then((roleFK) => {
                        roleClaim.setRole(roleFK).then(() => {
                            res.status(200).send({
                                message: "Role claim successfully entered.",
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

exports.getRoleClaim = (req, res) => {
    RoleClaim.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteRoleClaim = (req, res) => {
    RoleClaim.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                message: "Role claim successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Role claim cannot be deleted.",
            });
        });
};
