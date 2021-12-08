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
const PermissionClaims = db.permissionClaims;
const Op = db.Sequelize.Op;
const { Sequelize } = require("sequelize");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = (req, res) => {
  console.log(req.body);
  if (
    !req.body.userName ||
    !req.body.indexNumber ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.creationDate ||
    !req.body.roleFK ||
    !req.body.institutionFK
  ) {
    res.status(400).send({
      message: "All fields are required!",
    });
    return;
  }
  if (req.body.id) {
    Users.findOne({
      where: {
        indexNumber: {
          [Op.eq]: req.body.indexNumber,
        },
      },
    }).then((users) => {
      // Check if record exists in db

      var token = jwt.sign({ id: users.id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      users
        .update({
          indexNumber: req.body.indexNumber,
          userName: req.body.userName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          creationDate: req.body.creationDate,
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
              users.setRole(id);
            });
          }
        })
        .then(() => {
          res.send({
            status: 101,
            accessToken: token,
          });
        });
    });
  } else {
    console.log("date", req.body.creationDate);
    Users.create({
      indexNumber: req.body.indexNumber,
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      creationDate: req.body.creationDate,
    }).then((users) => {
      var token = jwt.sign({ id: users.indexNumber }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      if (req.body.institutionFK) {
        Institutions.findOne({
          where: {
            id: {
              [Op.eq]: req.body.institutionFK,
            },
          },
        }).then((id) => {
          users.setInstitution(id).then(() => {
            if (req.body.roleFK) {
              Roles.findOne({
                where: {
                  id: {
                    [Op.eq]: req.body.roleFK,
                  },
                },
              }).then((id) => {
                users
                  .setRole(id)
                  .then(() => {
                    res.send({
                      status: 101,
                      accessToken: token,
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message,
                    });
                  });
              });
            }
          });
        });
      }
    });
  }
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
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        users.password
      );

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
      let br = 0;

      UserClaim.findAll({
        where: {
          userFK: users.dataValues.id,
        },
        include: [
          {
            model: Users,
          },
          {
            model: PermissionClaims,
          },
        ],
      }).then((userClaim) => {
        for (let k = 0; k < userClaim.length; k++) {
          let type = userClaim[k].dataValues.permissionClaim.dataValues.type;
          let claimsArray = [];
          for (let l = 0; l < userClaim.length; l++) {
            if (userClaim[l] !== undefined) {
              if (
                type === userClaim[l].dataValues.permissionClaim.dataValues.type
              ) {
                let claim =
                  userClaim[l].dataValues.permissionClaim.dataValues.value;
                claimsArray.push(claim);
                br++;
              }
            }
          }
          claims[type] = claimsArray;
        }
      });

      RoleClaim.findAll({
        where: {
          roleFK: users.dataValues.roleFK,
        },
        include: [
          {
            model: Roles,
          },
          {
            model: PermissionClaims,
          },
        ],
      }).then((roleClaim) => {
        for (let i = 0; i < roleClaim.length; i++) {
          let type = roleClaim[i].dataValues.permissionClaim.dataValues.type;
          let valuesOfClaim =
            claims[roleClaim[i].dataValues.permissionClaim.dataValues.type];
          let valueOfType =
            roleClaim[i].dataValues.permissionClaim.dataValues.value.toString();

          if (
            roleClaim[i].dataValues.permissionClaim.dataValues.type in claims &&
            !valuesOfClaim.includes(valueOfType)
          ) {
            if (roleClaim[i] !== undefined) {
              if (
                type === roleClaim[i].dataValues.permissionClaim.dataValues.type
              ) {
                let claim =
                  roleClaim[i].dataValues.permissionClaim.dataValues.value;
                claims[type].push(claim);
              }
            }
          } else {
            let claimsArray = [];
            if (roleClaim[i] !== undefined) {
              if (
                type === roleClaim[i].dataValues.permissionClaim.dataValues.type
              ) {
                let claim =
                  roleClaim[i].dataValues.permissionClaim.dataValues.value;
                claimsArray.push(claim);
              }
            }
            claims[type] = claimsArray;
          }
        }
      });

      users.getRole().then((roles) => {
        res.status(200).send({
          id: users.id,
          indexNumber: users.indexNumber,
          userName: users.userName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          roles: roles.name,
          accessToken: token,
          institutionFK: users.institutionFK,
          claims: claims,
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
              [Op.between]: [req.params.startTime, req.params.endTime],
            },
            updatedAt: {
              [Op.between]: [req.params.startTime, req.params.endTime],
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
  if (!req.body.institutionId) {
    Users.findAll({
      include: [
        {
          model: Institutions,
        },
        {
          model: Roles,
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
  } else {
    Users.findAll({
      where: {
        institutionFK: req.body.institutionId,
      },
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Retrieval error.",
        });
      });
  }
};

exports.deleteUser = (req, res) => {
  Users.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.status(200).send({
        message: "User successfully deleted.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "User cannot be deleted.",
      });
    });
};

exports.changePassword = (req, res) => {
  Users.findOne({
    where: {
      id: req.body.id,
    },
  }).then((user) => {
    var passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );

    console.log(passwordIsValid)

    if (!passwordIsValid) {
      res.status(200).send({
        info: "Wrong old password!",
      });
    } else {
      user
        .update({
          password: bcrypt.hashSync(req.body.newPassword, 8),
        })
        .then(() => {
          res.status(200).send({
            status: 101,
            message: "Password successfully changed.",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err,
          });
        });
    }
  });
};
