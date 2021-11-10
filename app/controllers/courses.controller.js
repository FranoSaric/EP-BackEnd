const db = require("../models");
const config = require("../config/auth.config");
const Courses = db.courses;
const Studies = db.studies;
const Users = db.users;

const Op = db.Sequelize.Op;

//Kreira kolegij, potrebno preurediti da kreira kolegij za pojedini studij/ustanovu

exports.createCourse = (req, res) => {
    if (
        !req.body.name ||
        !req.body.academicYear ||
        !req.body.semester ||
        !req.body.userFK ||
        !req.body.studyFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Courses.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        })
            .then((courses) => {
                courses.update({
                    name: req.body.name,
                    academicYear: req.body.academicYear,
                    semester: req.body.semester,
                });
                if (req.body.userFK) {
                    Users.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.userFK,
                            },
                        },
                    }).then((userFK) => {
                        courses.setUser(userFK).then(() => {
                            if (req.body.studyFK) {
                                Studies.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.studyFK,
                                        },
                                    },
                                }).then((studyFK) => {
                                    courses.setStudy(studyFK).then(() => {
                                        res.status(200).send({
                                            status: 101,
                                            message:
                                                "The course was successfully edited.",
                                        });
                                    });
                                });
                            } else {
                                res.status(500).send({
                                    message: "The study was not sent",
                                });
                            }
                        });
                    });
                } else {
                    res.status(500).send({ message: "Staff not sent" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } else {
        Courses.create({
            name: req.body.name,
            academicYear: req.body.academicYear,
            semester: req.body.semester,
        })
            .then((courses) => {
                if (req.body.userFK) {
                    Users.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.userFK,
                            },
                        },
                    }).then((userFK) => {
                        courses.setUser(userFK).then(() => {
                            if (req.body.studyFK) {
                                Studies.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.studyFK,
                                        },
                                    },
                                }).then((studyFK) => {
                                    courses.setStudy(studyFK).then(() => {
                                        res.status(200).send({
                                            status: 101,
                                            message:
                                                "Course successfully entered.",
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
//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji
exports.getCourses = (req, res) => {
    if (req.body.userId) {
        Courses.findAll({
            where: { userFK: req.body.userId },
            include: [
                {
                    model: Users,
                },
                {
                    model: Studies,
                },
            ],
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Greška prilikom dohvata.",
                });
            });
    }else{
        Courses.findAll({
            include: [
                {
                    model: Users,
                },
                {
                    model: Studies,
                },
            ],
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Greška prilikom dohvata.",
                });
            });
    }
};

exports.deleteCourse = (req, res) => {
    Courses.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Course successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Course cannot be deleted.",
            });
        });
};
