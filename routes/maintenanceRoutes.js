const router = require("express").Router();
const maintenanceController = require("../controllers/maintenaceController");
const { authJwt } = require("../middlewares/index");
module.exports = (app) => {
  router.get("/maintenance/records", [authJwt.verifyToken], maintenanceController.getMaintenanceRecords);
  router.get("/maintenance/:carId", [authJwt.verifyToken], maintenanceController.getCarMaintenanceById);
  router.post("/maintenance/add", [authJwt.verifyToken], maintenanceController.addMaintenanceRecord);
  app.use(router);
};
