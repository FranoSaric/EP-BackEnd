const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Origin","http://localhost:3000",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/signUp",
        /* [verifySignUp.checkDuplicateUsernameOrEmail], */
        controller.signUp
    );

    app.post("/signIn", controller.signIn);

    app.get(
        "/findUser/:id/:startTime/:endTime",
        [authJwt.verifyToken, /*authJwt.isEmployee*/],
        controller.findUser
    );

    app.post(
        "/getUsers",
        [authJwt.verifyToken,/*authJwt.isEmployee*/],
        controller.getUsers
    );

    app.delete(
      "/deleteUser",
      [authJwt.verifyToken, authJwt.isEmployee],
        controller.deleteUser
    )
};
