const db = require("../models");
const config = require("../config/auth.config");
const Categories = db.categories;

const Op = db.Sequelize.Op;

exports.createCategory = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Category name is required!",
        });
        return;
    }
    if (req.params.id) {
        Categories.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.id,
                },
            },
        }).then((categories) => {
            categories
                .update({
                    name: req.body.name,
                })
                .then(() => {
                    res.status(200).send({
                        message: "Book category successfully edited.",
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Error editing book category.",
                    });
                });
        });
    } else {
        Categories.create({
            name: req.body.name,
        })
            .then(() => {
                res.status(200).send({
                    message: "Book category successfully entered.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Error creating book category.",
                });
            });
    }
};

exports.getCategories = (req, res) => {
    Categories.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};

exports.deleteCategory = (req, res) => {
    Categories.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(200).send({
                message: "Category successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Category cannot be deleted.",
            });
        });
};
