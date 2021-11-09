const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/institutions.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getInstitutions",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getInstitutions
    );
    app.post(
        "/createInstitution",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createInstitution
    );

    app.delete(
        "/deleteInstitution",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
          controller.deleteInstitution
      )
};
