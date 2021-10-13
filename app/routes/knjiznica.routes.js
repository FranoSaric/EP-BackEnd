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
    "/getLibraries", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.getLibraries);
  app.post(
    "/createLibrary", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.createLibrary);
};