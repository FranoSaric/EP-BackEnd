const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/knjiznica.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/findknjiznica", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.findAll);
  app.post(
    "/createknjiznica", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.createknjiznica);
};