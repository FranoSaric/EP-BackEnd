const db = require("../models");
const config = require("../config/auth.config");
const UserClaim = db.userClaim;
const Users = db.users;
const PermissionClaims = db.permissionClaims;

const Op = db.Sequelize.Op;

exports.createUserClaim = (req, res) => {
    if (!req.body.permissionClaimFK || !req.body.userFK) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        UserClaim.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((userClaim) => {
            userClaim.update({});
            if (req.body.userFK) {
                Users.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.userFK,
                        },
                    },
                })
                    .then((userFK) => {
                        UserClaim.setUser(userFK).then(() => {
                            if (req.body.permissionClaimFK) {
                                PermissionClaims.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.permissionClaimFK,
                                        },
                                    },
                                }).then((permissionClaimFK) => {
                                    userClaim
                                        .setPermissionClaim(permissionClaimFK)
                                        .then(() => {
                                            res.status(200).send({
                                                status: 101,
                                                message:
                                                    "User claim successfully edited.",
                                            });
                                        });
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "Error editing user claim.",
                        });
                    });
            }
        });
    } else {
        UserClaim.create({}).then((userClaim) => {
            if (req.body.userFK) {
                Users.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.userFK,
                        },
                    },
                })
                    .then((userFK) => {
                        userClaim.setUser(userFK).then(() => {
                            if (req.body.permissionClaimFK) {
                                PermissionClaims.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.permissionClaimFK,
                                        },
                                    },
                                }).then((permissionClaimFK) => {
                                    userClaim
                                        .setPermissionClaim(permissionClaimFK)
                                        .then((result) => {
                                            res.status(200).send({
                                                userClaimId:
                                                    result.dataValues.id,
                                                status: 101,
                                                message:
                                                    "User claim successfully entered.",
                                            });
                                        });
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            }
        });
    }
};

exports.getUserClaim = (req, res) => {
    UserClaim.findAll({
        include: [
            {
                model: PermissionClaims,
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

exports.deleteUserClaim = (req, res) => {
    UserClaim.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "User claim successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "User claim cannot be deleted.",
            });
        });
};
