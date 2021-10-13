const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/studiji.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/getStudies",
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.getStudies);
  app.post("/createStudy/:id?",
  [authJwt.verifyToken, authJwt.isDjelatnik], 
  controller.createStudy);
};