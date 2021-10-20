const db = require("../models");
const config = require("../config/auth.config");
const Users = db.users;
const Records = db.records;
const Classrooms = db.classrooms;
const Terms = db.terms;
const Roles = db.roles;
const Institutions = db.institutions;
const UserClaim = db.userClaim;
const RoleClaim = db.roleClaim;
const Op = db.Sequelize.Op;
const { Sequelize } = require("sequelize");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = (req, res) => {
    if (
        !req.body.userName &&
        !req.body.indexNumber &&
        !req.body.firtName &&
        !req.body.lastName &&
        !req.body.email &&
        !req.body.password &&
        !req.body.creationDate &&
        !req.body.roleFK &&
        !req.body.institutionFK
    ) {
        res.status(400).send({
            message: "All fields are required!",
        });
        return;
    }
    Users.findOne({
        where: {
            indexNumber: {
                [Op.eq]: req.body.indexNumber,
            },
        },
    }).then((users) => {
        // Check if record exists in db
        if (users) {
            var token = jwt.sign({ id: users.id }, config.secret, {
                expiresIn: 86400, // expires in 24 hours
            });
            console.log(token);
            users
                .update({
                    indexNumber: req.body.indexNumber,
                    userName: req.body.userName,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    creationDate: new Date(),
                })
                .then((users) => {
                    if (req.body.roleFK) {
                        Roles.findOne({
                            where: {
                                id: {
                                    [Op.eq]: req.body.roleFK,
                                },
                            },
                        }).then((id) => {
                            users.setRoles(id);
                        });
                    } else {
                        // user role = 1
                        users.setRoles(1);
                    }
                })
                .then(() => {
                    res.send({
                        message: "Update success!",
                        accessToken: token,
                    });
                });
        } else {
            Users.create({
                indexNumber: req.body.indexNumber,
                userName: req.body.userName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                creationDate: req.body.creationDate,
            })
                .then((users) => {
                    var token = jwt.sign(
                        { id: users.indexNumber },
                        config.secret,
                        {
                            expiresIn: 86400, // expires in 24 hours
                        }
                    );
                    if (req.body.institutionFK) {
                        Institutions.findOne({
                            where: {
                                id: {
                                    [Op.eq]: req.body.institutionFK,
                                },
                            },
                        }).then((id) => {
                            users.setInstitution(id);
                        });
                    }
                    if (req.body.roleFK) {
                        Roles.findOne({
                            where: {
                                id: {
                                    [Op.eq]: req.body.roleFK,
                                },
                            },
                        }).then((id) => {
                            users.setRole(id);
                        });
                    } else {
                        // user role = 1
                        users.setRole(1).then(() => {
                            res.send({
                                message: "Profesor successfully registered!",
                                accessToken: token,
                            });
                        });
                    }
                })
                .then(() => {
                    res.send({
                        message: "User successfully created!",
                        accessToken: token,
                    });
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message });
                });
        }
    });
};
//TODO("Napraviti signin preko sso za sum API")
exports.signIn = (req, res) => {
    console.log(req.body);
    Users.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then((users) => {
            if (!users) {
                return res.status(404).send({ message: "User not found." });
            }
            // var passwordIsValid = bcrypt.compareSync(
            //     req.body.password,
            //     users.password
            // );

            var passwordIsValid = true;
            // req.body.password === korisnik.password
            //     ? (passwordIsValid = true)
            //     : (passwordIsValid = false);

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Wrong password!",
                });
            }
            var token = jwt.sign({ id: users.indexNumber }, config.secret, {
                expiresIn: 86400, // expires in 24 hours
            });

            let claims = {};

            UserClaim.findAll({
                include: [
                    {
                        model: Users,
                        //  required: false
                    },
                ],
            }).then((userClaim) => {
                for (let k = 0; k < userClaim.length; k++) {
                    let type = userClaim[k].dataValues.claimType;
                    let claimsArray = [];
                    for (let l = 0; l < type.length; l++) {
                        if (userClaim[l] !== undefined) {
                            if (type === userClaim[l].dataValues.claimType) {
                                let claim = userClaim[l].dataValues.claimValue;
                                claimsArray.push(claim);
                            }
                        }
                    }
                    claims[type] = claimsArray;
                    // console.log("claimType",userClaim[i].dataValues.claimType)
                    // console.log("claimValue",userClaim[i].dataValues.claimValue)
                }
            });

            RoleClaim.findAll({
                include: [
                    {
                        model: Roles,
                        //  required: false
                    },
                ],
            }).then((roleClaim) => {
                console.log("roleClaim.length",roleClaim.length)
                for (let i = 0; i < roleClaim.length; i++) {
                    console.log("roletype", roleClaim[i].dataValues.claimType)
                    let type = roleClaim[i].dataValues.claimType;
                    
                    if (roleClaim[i].dataValues.claimType in claims) {
                        for (let j = 0; j < type.length; j++) {
                            if (roleClaim[j] !== undefined) {
                                if (
                                    type === roleClaim[j].dataValues.claimType
                                ) {
                                    let claim =
                                        roleClaim[j].dataValues.claimValue;
                                        claims[type].push(claim);
                                }
                            }
                        }
                        // console.log(
                        //     "claimType",
                        //     roleClaim[i].dataValues.claimType
                        // );
                        // console.log(
                        //     "claimValue",
                        //     roleClaim[i].dataValues.claimValue
                        // );
                    }else{
                        let claimsArray = [];
                        for (let j = 0; j < type.length; j++) {
                            if (roleClaim[j] !== undefined) {
                                if (
                                    type === roleClaim[j].dataValues.claimType
                                ) {
                                    let claim =
                                        roleClaim[j].dataValues.claimValue;
                                        claimsArray.push(claim);
                                }
                            }
                        }
                        claims[type] = claimsArray;
                    }
                }
                console.log("claimovi", claims);
            });

            users.getRole().then((roles) => {
                res.status(200).send({
                    indexNumber: users.indexNumber,
                    userName: users.userName,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    roles: roles.name,
                    accessToken: token,
                    claims: claims
                });
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
//TODO("ispis svih korisnika za evidenciju")
exports.findUser = (req, res) => {
    Users.findAll({
        include: [
            {
                model: Records,
                include: [
                    {
                        model: Classrooms,
                        include: [
                            {
                                model: Terms,
                                where: {
                                    id: req.params.id,
                                },
                            },
                        ],
                    },
                ],
                where: [
                    {
                        id: { [Op.ne]: null },
                        createdAt: {
                            [Op.between]: [
                                req.params.startTime,
                                req.params.endTime,
                            ],
                        },
                        updatedAt: {
                            [Op.between]: [
                                req.params.startTime,
                                req.params.endTime,
                            ],
                        },
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

exports.getUsers = (req, res) => {
    Korisnik.findAll({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Retrieval error.",
            });
        });
};