const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/knjiga.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/findknjiga", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.findAll);
  app.post(
    "/createknjiga", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.createknjiga);
};