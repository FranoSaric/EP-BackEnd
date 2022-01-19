const db = require("../models");
const config = require("../config/auth.config");
const { studies } = require("../models");
const Exam = db.exam;
const Course = db.courses;
const Classroom = db.classrooms
const Study = db.studies

const Op = db.Sequelize.Op;

exports.getExams = (req, res) => {
    Exam.findAll({
        include: [
            {
                model: Course,
            },
            {
                model: Classroom
            }
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


exports.getExamsForOneStudent = (req, res) => {
    if (!req.body.year) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    Exam.findAll({
        include: [
            {
                model: Course,
                include: [
                    {
                        model: Study,
                        where: {
                            year: req.body.year
                        }
                    }
                ]
            },
            {
                model: Classroom
            }
        ],
    }).then((data) => {
        let test = data.filter(data =>  data.dataValues.course )
            console.log(test)
            res.send(test);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });

    // Study.findAll({
    //     where: {
    //         year: 1
    //     }
    // }).then((studies) => {
    //     Exam.findAll({
    //         include: [
    //             {
    //                 model: Course,
    //                 where: {
    //                     studyFK: studies.id
    //                 }
    //             },
    //             {
    //                 model: Classroom
    //             }
    //         ],
    //     })
    // }).then((data) => {
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             message: err.message || "Retrieval error.",
    //         });
    //     });
};