const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/terms.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getTerms/:id",
        [
            /* authJwt.verifyToken, authJwt.isDjelatnik */
        ],
        controller.getTerms
    );
    app.post(
        "/createTerm/:id?",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.createTerm
    );

    app.delete(
      "/deleteTerm/:id",
      [authJwt.verifyToken, authJwt.isEmployee],
        controller.deleteTerm
    )
};
