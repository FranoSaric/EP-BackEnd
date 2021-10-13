const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/kategorija.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/getCategories", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.getCategories);
  app.post(
    "/createCategory/:id?", 
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.createCategory);
};