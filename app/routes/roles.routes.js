const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/roles.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getRoles",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.getRoles
    );
    app.post(
        "/createRole",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.createRole
    );

    app.delete(
        "/deleteRole",
        [authJwt.verifyToken, authJwt.isEmployee],
          controller.deleteRole
      )
};
