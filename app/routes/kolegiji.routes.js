const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/kolegiji.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/getColleges/:id",
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.getColleges);
  app.post(
    "/createCollege/:id?",
    [authJwt.verifyToken, authJwt.isDjelatnik], 
    controller.createCollege);
};