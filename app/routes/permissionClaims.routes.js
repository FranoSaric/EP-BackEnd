const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/permissionClaims.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getPermissionClaims",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getPermissionClaims
    );
    app.post(
        "/createPermissionClaim",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createPermissionClaim
    );

    app.delete(
        "/deletePermissionClaim",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
          controller.deletePermissionClaim
      )
};
