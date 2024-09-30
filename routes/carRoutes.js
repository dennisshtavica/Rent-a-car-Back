const router = require("express").Router();
const carsController = require("../controllers/carsController")
const bookingsController = require('../controllers/bookingsController')
const { authJwt, multerMiddleware } = require("../middlewares/index");

module.exports = (app) => {
    router.post("/addCar", [authJwt.verifyToken], multerMiddleware.upload.single("image"), carsController.addCar);
    router.delete("/deleteCars", [authJwt.verifyToken], carsController.deleteCars);
    router.get("/getCars", [authJwt.verifyToken], carsController.getCars);
    router.get("/search-results/:carBrand/:carModel", [authJwt.verifyToken], carsController.searchCars);
    router.get("/bookingPage/:id", [authJwt.verifyToken], carsController.getOneCar);

    //new routes for getting car brands and models
    router.get("/getCarBrands", [authJwt.verifyToken], carsController.getCarBrands);
    router.get("/getCarModels/:brand", [authJwt.verifyToken], carsController.getCarModels);

    router.post('/bookings', [authJwt.verifyToken], bookingsController.addBooking);
    router.get('/carsRented/:userId', [authJwt.verifyToken], bookingsController.getBookedCar);
    router.delete('/cancelBooking/:userId/:bookingId', [authJwt.verifyToken], bookingsController.cancelBooking);

    app.use(router);
};
