const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/roleClaim.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/getRoleClaim",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getRoleClaim
    );
    app.post(
        "/createRoleClaim",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createRoleClaim
    );

    app.delete(
        "/deleteRoleClaim",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
          controller.deleteRoleClaim
      )
};
