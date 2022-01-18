const db = require("../models");
const config = require("../config/auth.config");
const Exam = db.exam;
const Course = db.courses;
const Classroom = db.classrooms

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

