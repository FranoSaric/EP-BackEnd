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
    "/signUp",
    /* [verifySignUp.checkDuplicateUsernameOrEmail], */
    controller.signUp
  ); 

  app.post("/signIn", controller.signIn);

  app.get(
    "/findUser/:id/:startTime/:endTime",
    [authJwt.verifyToken, authJwt.isDjelatnik], 
    controller.findUser);

    app.get(
      "/getUsers",
      [authJwt.verifyToken, authJwt.isDjelatnik], 
      controller.getUsers);


};