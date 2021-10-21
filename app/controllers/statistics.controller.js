const db = require("../models");
const config = require("../config/auth.config");
const Statistics = db.statistics;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.createStatistics = (req, res) => {
    if (!req.body.presence && !req.body.userFK) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.params.id) {
        Statistics.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        }).then((statistics) => {
            statistics.update({
                presence: req.body.presence,
            });
            if (req.body.userFK) {
                Users.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.userFK,
                        },
                    },
                })
                    .then((userFK) => {
                        statistics.setUser(userFK).then(() => {
                            res.status(200).send({
                                message: "Statistics successfully edited.",
                            });
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(500).send({ message: "User not sent" });
            }
        });
    } else {
        Statistics.create({
            presence: req.body.presence,
        }).then((statistics) => {
            if (req.body.userFK) {
                Users.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.userFK,
                        },
                    },
                })
                    .then((userFK) => {
                        statistics.setUser(userFK).then(() => {
                            res.status(200).send({
                                message: "Statistics successfully entered.",
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

exports.getStatistics = (req, res) => {
    Statistics.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteStatistic = (req, res) => {
    Statistics.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(200).send({
                message: "Statistic claim successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Statistic claim cannot be deleted.",
            });
        });
};
