const { authJwt } = require("../middleware");
const controller = require("../controllers/korisnik.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/all", controller.allAccess);

  app.get(
    "/student",
    [authJwt.verifyToken],
    controller.studentBoard
  );

  app.get(
    "/profesor",
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.djelatnikBoard
  );
};