const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/classrooms.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/getClassrooms",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getClassrooms
    );
    app.post(
        "/createClassroom",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createClassroom
    );

    app.delete(
        "/deleteClassroom",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.deleteClassroom
    );
};
