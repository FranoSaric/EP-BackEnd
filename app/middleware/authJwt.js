const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.indexNumber = decoded.id;
        next();
    });
};

isEmployee = (req, res, next) => {
    Users.findOne({
        where: {
            indexNumber: {
                [Op.eq]: req.indexNumber,
            },
        },
    }).then((users) => {
        users.getRole().then((roles) => {
            if (roles.name === "djelatnik") {
                next();
                return;
            }

            res.status(403).send({
                message: "Required employee role!",
            });
            return;
        });
    });
};

isStudent = (req, res, next) => {
    Users.findOne({
        where: {
            indexNumber: {
                [Op.eq]: req.indexNumber,
            },
        },
    }).then((users) => {
        users.getRoles().then((roles) => {
            if (roles.name === "student") {
                next();
                return;
            }

            res.status(403).send({
                message: "Required student role!",
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isEmployee: isEmployee,
    isStudent: isStudent,
};
module.exports = authJwt;
