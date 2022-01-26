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
    if (!req.body.id) {
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
                            id: req.body.id
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
            res.send(test);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });

};