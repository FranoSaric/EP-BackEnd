const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/booksLibrary.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getBooksLibrary",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.getBooksLibrary
    );
    app.post(
        "/createBookLibrary",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.createBookLibrary
    );

    app.delete(
        "/deleteBookLibrary",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
          controller.deleteBookLibrary
      )
};
