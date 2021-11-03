const db = require("../models");
const config = require("../config/auth.config");
const Records = db.records;
const Classrooms = db.classrooms;
const Users = db.users;

const Op = db.Sequelize.Op;

exports.createRecord = (req, res) => {
    if (!req.body.userFK || !req.body.classroomFK || !req.body.checkInTime) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Records.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        })
            .then((records) => {
                records.update({ checkInTime: req.body.checkInTime });
                if (req.body.userFK) {
                    Users.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.userFK,
                            },
                        },
                    }).then((userFK) => {
                        records.setUser(userFK).then(() => {
                            if (req.body.classroomFK) {
                                Classrooms.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.classroomFK,
                                        },
                                    },
                                }).then((classroomFK) => {
                                    records
                                        .setClassroom(classroomFK)
                                        .then(() => {
                                            res.status(200).send({
                                                status: 101,
                                                message:
                                                    "Record successfully edited.",
                                            });
                                        });
                                });
                            } else {
                                res.status(500).send({
                                    message: "Classroom not sent",
                                });
                            }
                        });
                    });
                } else {
                    res.status(500).send({ message: "Person not sent" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } else {
        Records.create({ checkInTime: req.body.checkInTime })
            .then((records) => {
                if (req.body.userFK) {
                    Users.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.userFK,
                            },
                        },
                    }).then((userFK) => {
                        records.setUser(userFK).then(() => {
                            if (req.body.classroomFK) {
                                Classrooms.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.classroomFK,
                                        },
                                    },
                                })
                                    .then((classroomFK) => {
                                        records
                                            .setClassroom(classroomFK)
                                            .then(() => {
                                                res.status(200).send({
                                                    status: 101,
                                                    message:
                                                        "Record successfully entered.",
                                                });
                                            });
                                    })
                                    .catch((err) => {
                                        res.status(500).send({
                                            message: err.message,
                                        });
                                    });
                            }
                        });
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    }
};
exports.getRecords = (req, res) => {
    Records.findAll({
        include: [
            {
                model: Classrooms,
            },
            {
                model: Users,
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

exports.deleteRecord = (req, res) => {
    Records.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Record successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Record cannot be deleted.",
            });
        });
};
