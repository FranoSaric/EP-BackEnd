const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/records.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getRecords",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.getRecords
    );

    app.post(
        "/createRecord/:id?",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.createRecord
    );
};
