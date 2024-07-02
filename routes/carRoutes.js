const router = require("express").Router();
const carsController = require("../controllers/carsController")
const bookingsController = require('../controllers/bookingsController')
const { authJwt, multerMiddleware } = require("../middlewares/index");


module.exports = (app) => {
    // app.use(function (req, res, next) {
    //   res.header(
    //     "Access-Control-Allow-Headers",
    //     "x-access-token, Origin, Content-Type, Accept"
    //   );
  
    //   next();
    // });
  
    router.post("/addCar", [authJwt.verifyToken], multerMiddleware.upload.single("image") ,carsController.addCar)
    router.delete("/deleteCars", [authJwt.verifyToken], carsController.deleteCars)
    router.get("/getCars", [authJwt.verifyToken], carsController.getCars)
    router.get("/search-results/:carBrand/:carModel", [authJwt.verifyToken], carsController.searchCars)
    router.get("/bookingPage/:id", [authJwt.verifyToken], carsController.getOneCar)
    router.post('/bookings', [authJwt.verifyToken], bookingsController.addBooking)
    router.get('/carsRented/:userId', [authJwt.verifyToken], bookingsController.getBookedCar)
    router.delete('/cancelBooking/:userId/:bookingId', [authJwt.verifyToken], bookingsController.cancelBooking)

    app.use(router);
  };
   