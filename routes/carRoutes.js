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
    router.post("/create-checkout-session", bookingsController.createPaymentIntent)
    //new routes for getting car brands and models
    router.get("/getCarBrands", [authJwt.verifyToken], carsController.getCarBrands);
    router.get("/getCarModels/:brand", [authJwt.verifyToken], carsController.getCarModels);

    router.get('/bookings', [authJwt.verifyToken], bookingsController.getBookings);
    router.post('/bookings', [authJwt.verifyToken], bookingsController.addBooking);
    router.get('/carsRented/:userId', [authJwt.verifyToken], bookingsController.getBookedCar);
    router.delete('/cancelBooking/:userId/:bookingId', [authJwt.verifyToken], bookingsController.cancelBooking);
    router.get('/allBookings', [authJwt.verifyToken], bookingsController.getAllBookings);

    router.put("/updateCar/:id", 
        [authJwt.verifyToken], 
        multerMiddleware.upload.single("image"), 
        carsController.updateCar
    );

    router.get("/features", [authJwt.verifyToken], carsController.getFeatures);
    router.get("/categories", [authJwt.verifyToken], carsController.getCategories);
    router.delete("/cars/:id", [authJwt.verifyToken], carsController.deleteCar);

    

    app.use(router);
};
