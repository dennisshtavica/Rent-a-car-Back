const router = require("express").Router();
const driverVerificationController = require("../controllers/driverVerificationController");
const { authJwt } = require("../middlewares/index");

module.exports = (app) => {
  router.post(
    "/driver-verification/submit", 
    [authJwt.verifyToken], 
    driverVerificationController.submitVerification
  );

  router.get(
    "/driver-verification/status", 
    [authJwt.verifyToken], 
    driverVerificationController.getVerificationStatus
  );

  app.use(router);
};
