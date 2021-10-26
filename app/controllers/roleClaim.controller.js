const db = require("../models");
const config = require("../config/auth.config");
const RoleClaim = db.roleClaim;
const Roles = db.roles;
const PermissionClaims = db.permissionClaims;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.createRoleClaim = (req, res) => {
    if (!req.body.permissionClaimFK || !req.body.roleFK) {
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
            roleClaim.update({});
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
                            if (req.body.permissionClaimFK) {
                                PermissionClaims.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.permissionClaimFK,
                                        },
                                    },
                                }).then((permissionClaimFK) => {
                                    roleClaim
                                        .setPermissionClaim(permissionClaimFK)
                                        .then(() => {
                                            res.status(200).send({
                                                status: 101,
                                                message:
                                                    "Role claim successfully edited.",
                                            });
                                        });
                                });
                            }
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
        RoleClaim.create({}).then((roleClaim) => {
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
                            if (req.body.permissionClaimFK) {
                                PermissionClaims.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.permissionClaimFK,
                                        },
                                    },
                                }).then((permissionClaimFK) => {
                                    roleClaim
                                        .setPermissionClaim(permissionClaimFK)
                                        .then((result) => {
                                            console.log("neki id", result);
                                            res.status(200).send({
                                                roleClaimId:
                                                    result.dataValues.id,
                                                status: 101,
                                                message:
                                                    "Role claim successfully entered.",
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

exports.getRoleClaim = (req, res) => {
    console.log("id sto dolazi", req.body);
    if (req.body.userId) {
        Users.findAll({
            where: {
                id: req.body.userId,
            },
            include: [
                {
                    model: Roles,
                    // where:{
                    //    roleFK: roleFK
                    // }
                },
                // {
                //     model: PermissionClaims,
                // },
            ],
        })
            .then((data) => {
                console.log(data[0].dataValues.roleFK)
                RoleClaim.findAll({
                    where: {
                        roleFK: data[0].dataValues.roleFK,
                    },
                    include:[
                        {
                            model:PermissionClaims
                        }
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
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Retrieval error.",
                });
            });
    } else {
        RoleClaim.findAll({
            include: [
                {
                    model: PermissionClaims,
                },
            ],
            where: {
                roleFK: req.body.id,
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
    }
};

exports.deleteRoleClaim = (req, res) => {
    RoleClaim.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Role claim successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Role claim cannot be deleted.",
            });
        });
};
