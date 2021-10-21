const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/categories.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/getCategories",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.getCategories
    );
    app.post(
        "/createCategory",
        [authJwt.verifyToken, authJwt.isEmployee],
        controller.createCategory
    );

    app.delete(
      "/deleteCategory",
      [authJwt.verifyToken, authJwt.isEmployee],
        controller.deleteCategory
    )
};
