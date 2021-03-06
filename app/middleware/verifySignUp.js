const db = require("../models");
const Roles = db.role;
const Users = db.users;

/* checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      brojIndexa: req.body.brojIndexa
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! brojIndexa is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
}; */

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!Roles.includes(req.body.roles[i])) {
                res.status(400).send({
                    message:
                        "Failed! Role does not exist = " + req.body.roles[i],
                });
                return;
            }
        }
    }

    next();
};

/* const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
}; */

/* module.exports = verifySignUp; */
