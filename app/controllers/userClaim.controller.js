const db = require("../models");
const config = require("../config/auth.config");
const UserClaim = db.userClaim;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.createUserClaim = (req, res) => {
    if (!req.body.claimType || !req.body.claimValue || !req.body.userFK) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.params.id) {
        UserClaim.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        }).then((userClaim) => {
            userClaim.update({
                claimType: req.body.claimType,
                claimValue: req.body.claimValue,
            });
            if (req.body.userFK) {
                Users.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.userFK,
                        },
                    },
                })
                    .then(() => {
                        res.status(200).send({
                            message: "User claim successfully edited.",
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
        UserClaim.create({
            claimType: req.body.claimType,
            claimValue: req.body.claimValue,
        }).then((userClaim) => {
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
                            res.status(200).send({
                                message: "User claim successfully entered.",
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

exports.getUserClaim = (req, res) => {
    UserClaim.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};
