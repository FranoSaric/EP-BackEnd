const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/books.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getBooks",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.getBooks
    );
    app.post(
        "/createBook/:id?",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.createBook
    );

    app.delete(
      "/deleteBook/:id",
      [authJwt.verifyToken, authJwt.isEmployee],
        controller.deleteBook
    )
};
