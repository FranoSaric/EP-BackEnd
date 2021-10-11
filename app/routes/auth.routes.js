const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

   app.post(
    "/signup",
    /* [verifySignUp.checkDuplicateUsernameOrEmail], */
    controller.signup
  ); 

  app.post("/signin", controller.signin);

  app.get(
    "/findkorisnik/:id/:startTime/:endTime",
    [authJwt.verifyToken, authJwt.isDjelatnik], 
    controller.findAll);

  app.get(
    "/findprofessors",
    [authJwt.verifyToken, authJwt.isDjelatnik], 
    controller.findAllProfessors);
};