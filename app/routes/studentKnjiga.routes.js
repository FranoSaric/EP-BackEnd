const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/studentKnjiga.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/getStudentBooks",
    [authJwt.verifyToken, authJwt.isDjelatnik],
    controller.getStudentBooks);
  app.post("/createStudentBook/:id?",
  [authJwt.verifyToken, authJwt.isDjelatnik], 
  controller.createStudentBook);
};