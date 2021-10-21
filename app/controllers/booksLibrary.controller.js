const db = require("../models");
const config = require("../config/auth.config");
const BooksLibrary = db.booksLibrary;
const Books = db.books;
const Library = db.library;

const Op = db.Sequelize.Op;

exports.createBookLibrary = (req, res) => {
    if (!req.body.libraryFK || !req.body.bookFK) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        BooksLibrary.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        })
            .then((booksLibrary) => {
                booksLibrary.update({});
                if (req.body.libraryFK) {
                    Library.findOne({
                        where: {
                            id: {
                                [Op.eq]: req.body.libraryFK,
                            },
                        },
                    })
                        .then((libraryFK) => {
                            booksLibrary.setLibrary(libraryFK).then(() => {
                                if (req.body.bookFK) {
                                    Books.findOne({
                                        where: {
                                            id: {
                                                [Op.eq]: req.body.bookFK,
                                            },
                                        },
                                    }).then((bookFK) => {
                                        booksLibraries
                                            .setBook(bookFK)
                                            .then(() => {
                                                res.status(200).send({
                                                    message:
                                                        "Book-Library successfully edited.",
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
                    res.status(500).send({ message: "Library not sent" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } else {
        BooksLibrary.create({}).then((booksLibrary) => {
            if (req.body.libraryFK) {
                Library.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.libraryFK,
                        },
                    },
                })
                    .then((libraryFK) => {
                        booksLibrary.setLibrary(libraryFK).then(() => {
                            if (req.body.bookFK) {
                                Books.findOne({
                                    where: {
                                        id: {
                                            [Op.eq]: req.body.bookFK,
                                        },
                                    },
                                }).then((bookFK) => {
                                    booksLibrary.setBook(bookFK).then(() => {
                                        res.status(200).send({
                                            message:
                                                "Book-Library successfully entered.",
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

exports.getBooksLibrary = (req, res) => {
    BooksLibrary.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteBookLibrary = (req, res) => {
    BooksLibrary.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                message: "Book library successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Book library cannot be deleted.",
            });
        });
};
