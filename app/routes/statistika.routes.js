const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/statistika.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/getStatistics",
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.getStatistics);
  app.post("/createStatistics/:id?",
  [authJwt.verifyToken, authJwt.isDjelatnik], 
  controller.createStatistics);
};