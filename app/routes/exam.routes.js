const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/exams.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/getExams",
        [authJwt.verifyToken],
        controller.getExams
    );


    // app.post(
    //     "/createCourse",
    //     [authJwt.verifyToken, /*authJwt.isEmployee*/],
    //     controller.createCourse
    // );

    // app.delete(
    //   "/deleteCourse",
    //   [authJwt.verifyToken, /*authJwt.isEmployee*/],
    //     controller.deleteCourse
    // )
};
