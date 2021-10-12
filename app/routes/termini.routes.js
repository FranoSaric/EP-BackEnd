const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/termini.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/findtermini/:id", 
    [/* authJwt.verifyToken, authJwt.isDjelatnik */],
    controller.findAll);
  app.post(
    "/createtermini/:id?",
    [authJwt.verifyToken, authJwt.isDjelatnik], 
    controller.createtermini);
};