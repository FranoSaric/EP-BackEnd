const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/statistics.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getStatistics",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getStatistics
    );
    app.post(
        "/createStatistics",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createStatistics
    );

    app.delete(
      "/deleteStatistic",
      [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.deleteStatistic
    )
};
