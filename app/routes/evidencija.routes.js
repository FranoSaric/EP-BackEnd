const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/evidencija.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 
  app.get(
    "/getRecords",
    [authJwt.verifyToken, authJwt.isDjelatnik], 
    controller.getRecords);


  app.post(
    "/createRecord",
    controller.createRecord);
  
};