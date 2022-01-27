const db = require("../models");
const config = require("../config/auth.config");
const { studies } = require("../models");
const Exam = db.exam;
const Course = db.courses;
const Classroom = db.classrooms;
const Study = db.studies;

const Op = db.Sequelize.Op;

exports.createExam = (req, res) => {
  if (!req.body.date || !req.body.courseFK || !req.body.classroomFK) {
    res.status(400).send({
      message: "All fields are required!",
    });
    return;
  }
  if (req.body.id) {
    Exam.findOne({
      where: {
        id: {
          [Op.eq]: req.body.id,
        },
      },
    })
      .then((exam) => {
        exam.update({
          date: req.body.date,
        });
        if (req.body.courseFK) {
          Course.findOne({
            where: {
              id: {
                [Op.eq]: req.body.courseFK,
              },
            },
          }).then((courseFK) => {
            exam.setCourse(courseFK).then(() => {
              if (req.body.classroomFK) {
                Classroom.findOne({
                  where: {
                    id: {
                      [Op.eq]: req.body.classroomFK,
                    },
                  },
                }).then((classroomFK) => {
                  exam.setClassroom(classroomFK).then(() => {
                    res.status(200).send({
                      status: 101,
                      message: "Date successfully edited.",
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
    Exam.create({
      date: req.body.date,
      duration: req.body.duration,
    })
      .then((exam) => {
        if (req.body.courseFK) {
          Course.findOne({
            where: {
              id: {
                [Op.eq]: req.body.courseFK,
              },
            },
          }).then((courseFK) => {
            exam.setCourse(courseFK).then(() => {
              if (req.body.classroomFK) {
                Classroom.findOne({
                  where: {
                    id: {
                      [Op.eq]: req.body.classroomFK,
                    },
                  },
                }).then((classroomFK) => {
                  exam.setClassroom(classroomFK).then(() => {
                    res.status(200).send({
                      status: 101,
                      message: "Term successfully entered.",
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

exports.getExams = (req, res) => {
  Exam.findAll({
    include: [
      {
        model: Course,
      },
      {
        model: Classroom,
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
              id: req.body.id,
            },
          },
        ],
      },
      {
        model: Classroom,
      },
    ],
  })
    .then((data) => {
      let test = data.filter((data) => data.dataValues.course);
      res.send(test);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Retrieval error.",
      });
    });
};

exports.deleteExam = (req, res) => {
  Exam.destroy({
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      res.status(200).send({
        status: 101,
        message: "Exam successfully deleted.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Exam cannot be deleted.",
      });
    });
};
