const db = require("../models");
const config = require("../config/auth.config");
const Books = db.books;
const Categories = db.categories;

const Op = db.Sequelize.Op;

exports.createBook = (req, res) => {
    if (
        !req.body.barCode ||
        !req.body.name ||
        !req.body.author ||
        !req.body.categoryFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    if (req.body.id) {
        Books.findOne({
            where: {
                id: {
                    [Op.eq]: req.body.id,
                },
            },
        }).then((books) => {
            books.update({
                barCode: req.body.barCode,
                name: req.body.name,
                author: req.body.author,
            });
            if (req.body.categoryFK) {
                Categories.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.categoryFK,
                        },
                    },
                })
                    .then((categoryFK) => {
                        books.setCategory(categoryFK).then(() => {
                            res.status(200).send({
                                status: 101,
                                message: "Book successfully edited.",
                            });
                        });
                    })
                    .catch((err) => {
                        res.status(500).send({ message: err.message });
                    });
            } else {
                res.status(500).send({ message: "Category not sent" });
            }
        });
    } else {
        Books.create({
            barCode: req.body.barCode,
            name: req.body.name,
            author: req.body.author,
        }).then((books) => {
            if (req.body.categoryFK) {
                Categories.findOne({
                    where: {
                        id: {
                            [Op.eq]: req.body.categoryFK,
                        },
                    },
                })
                    .then((categoryFK) => {
                        books.setCategory(categoryFK).then(() => {
                            res.status(200).send({
                                status: 101,
                                message: "Book successfully entered.",
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

//Ispis svih kolegija, potrebno preurediti da ispisuje popis svih kolegija za pojedini studiji

exports.getBooks = (req, res) => {
    Books.findAll({
        where: {},
        include: [
            {
                model: Categories,
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

exports.deleteBook = (req, res) => {
    Books.destroy({
        where: {
            id: req.body.id,
        },
    })
        .then(() => {
            res.status(200).send({
                status: 101,
                message: "Book successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Book cannot be deleted.",
            });
        });
};
