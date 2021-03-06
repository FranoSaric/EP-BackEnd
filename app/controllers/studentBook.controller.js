const db = require("../models");
const config = require("../config/auth.config");
const StudentBook = db.studentBook;
const Books = db.books;
const Users = db.users;
const Categories = db.categories

const Op = db.Sequelize.Op;

exports.createStudentBook = (req, res) => {
    if (
        !req.body.pickUpDate ||
        !req.body.userFK ||
        !req.body.bookFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        StudentBook.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        })
            .then((studentBook) => {
                studentBook.update({
                    pickUpDate: req.body.pickUpDate,
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
                            studentBook.setUser(userFK).then(() => {
                                if (req.body.bookFK) {
                                    Books.findOne({
                                        where: {
                                            id: {
                                                [Op.eq]: req.body.bookFK,
                                            },
                                        },
                                    }).then((bookFK) => {
                                        studentBook
                                            .setBook(bookFK)
                                            .then(() => {
                                                res.status(200).send({
                                                    status:101,
                                                    message:
                                                        "Student-book successfully edited.",
                                                });
                                            });
                                    });
                                } else {
                                    res.status(500).send({
                                        message: "Book not sent",
                                    });
                                }
                            });
                        })
                        .catch((err) => {
                            res.status(500).send({ message: err.message });
                        });
                } else {
                    res.status(500).send({ message: "Person not sent" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } else {
        StudentBook.create({
            pickUpDate: req.body.pickUpDate,
        }).then((studentBook) => {
            if (req.body.userFK) {
                Users.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.userFK,
                        },
                    },
                })
                    .then((userFK) => {
                        studentBook.setUser(userFK).then(() => {
                            if (req.body.bookFK) {
                                Books.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.bookFK,
                                        },
                                    },
                                }).then((bookFK) => {
                                    studentBook.setBook(bookFK).then(() => {
                                        res.status(200).send({
                                            status:101,
                                            message:
                                                "Student-book successfully entered.",
                                        });
                                    });
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            }
        });
    }
};


exports.getStudentBooks = (req, res) => {
    StudentBook.findAll({
        where: {},
        include: [
            {
                model: Users,
            },
            {
                model: Books,
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


exports.getBooksForOneStudent = (req, res) => {
    StudentBook.findAll({
        include: [
            {
                model: Users,
                where: {
                    id: req.body.userFK,
                },
            },
            {
                model: Books,
                include: [
                    {
                        model: Categories,
                    },
                ],
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

exports.deleteStudentBook = (req, res) => {
    StudentBook.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status:101,
                message: "Student book claim successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Student book claim cannot be deleted.",
            });
        });
};
