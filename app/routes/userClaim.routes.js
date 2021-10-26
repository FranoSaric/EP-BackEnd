const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/userClaim.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/getUserClaim",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.getUserClaim
    );
    app.post(
        "/createUserClaim",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.createUserClaim
    );

    app.delete(
        "/deleteUserClaim",
        [authJwt.verifyToken, authJwt.isEmployee],
          controller.deleteUserClaim
      )
};
