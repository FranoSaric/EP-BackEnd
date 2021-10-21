const db = require("../models");
const config = require("../config/auth.config");
const Classrooms = db.classrooms;
const Institutions = db.institutions;

const Op = db.Sequelize.Op;

exports.createClassroom = (req, res) => {
    if (
        !req.body.numberOfClassroom ||
        !req.body.numberOfSeats ||
        !req.body.floor ||
        !req.body.free
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Classrooms.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((classrooms) => {
            classrooms.update({
                numberOfClassroom: req.body.numberOfClassroom,
                numberOfSeats: req.body.numberOfSeats,
                floor: req.body.floor,
                free: req.body.free,
            });
            if (req.body.institutionFK) {
                Institutions.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.institutionFK,
                        },
                    },
                })
                    .then(() => {
                        res.status(200).send({
                            message: "Classroom successfully decorated.",
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({
                            message: err.message || "Error editing classroom.",
                        });
                    });
            }
        });
    } else {
        Classrooms.create({
            numberOfClassroom: req.body.numberOfClassroom,
            numberOfSeats: req.body.numberOfSeats,
            floor: req.body.floor,
            free: req.body.free,
        }).then((classrooms) => {
            if (req.body.institutionFK) {
                Institutions.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.institutionFK,
                        },
                    },
                })
                    .then((institutionFK) => {
                        classrooms.setInstitution(institutionFK).then(() => {
                            res.status(200).send({
                                message: "Classroom successfully entered.",
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

exports.getClassrooms = (req, res) => {
    Classrooms.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteClassroom = (req, res) => {
    Classrooms.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                message: "Classroom successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Classroom cannot be deleted.",
            });
        });
};
