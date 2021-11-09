const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/studentBook.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getStudentBooks",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getStudentBooks
    );
    app.post(
        "/createStudentBook",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createStudentBook
    );

    app.delete(
      "/deleteStudentBook",
      [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.deleteStudentBook
    )
};
