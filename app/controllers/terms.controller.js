const db = require("../models");
const config = require("../config/auth.config");
const Terms = db.terms;
const Classrooms = db.classrooms;
const Courses = db.courses;

const Op = db.Sequelize.Op;

exports.createTerm = (req, res) => {
    if (
        !req.body.date ||
        !req.body.startTime ||
        !req.body.endTime ||
        !req.body.duration ||
        !req.body.courseFK ||
        !req.body.classroomFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Terms.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        })
            .then((terms) => {
                terms.update({
                    date: req.body.date,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    duration: req.body.duration,
                });
                if (req.body.courseFK) {
                    Courses.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.courseFK,
                            },
                        },
                    }).then((courseFK) => {
                        terms.setCourse(courseFK).then(() => {
                            if (req.body.classroomFK) {
                                Classrooms.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.classroomFK,
                                        },
                                    },
                                }).then((classroomFK) => {
                                    terms.setClassroom(classroomFK).then(() => {
                                        res.status(200).send({
                                            status: 101,
                                            message:
                                                "Date successfully edited.",
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
                    res.status(500).send({ message: "Course not sent" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } else {
        Terms.create({
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            duration: req.body.duration,
        })
            .then((terms) => {
                if (req.body.courseFK) {
                    Courses.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.courseFK,
                            },
                        },
                    }).then((courseFK) => {
                        terms.setCourse(courseFK).then(() => {
                            if (req.body.classroomFK) {
                                Classrooms.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.classroomFK,
                                        },
                                    },
                                }).then((classroomFK) => {
                                    terms.setClassroom(classroomFK).then(() => {
                                        res.status(200).send({
                                            status: 101,
                                            message:
                                                "Term successfully entered.",
                                        });
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

exports.getTerms = (req, res) => {
    Terms.findAll({
        include: [
            {
                model: Courses,
            },
            {
                model: Classrooms,
            },
        ] /* ,
      where: {
        kolegijiFK : req.params.id
      }  */,
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

exports.deleteTerm = (req, res) => {
    Terms.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Term successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Term cannot be deleted.",
            });
        });
};
