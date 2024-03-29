const router = require("express").Router();
const carsController = require("../controllers/carsController")
const bookingsController = require('../controllers/bookingsController')
const { authJwt, multerMiddleware } = require("../middlewares/index");


module.exports = (app) => {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
  
      next();
    });
  
    router.post("/addCar", multerMiddleware.upload.single("image") ,carsController.addCar)
    router.delete("/deleteCars", carsController.deleteCars)
    router.get("/getCars", carsController.getCars)
    router.get("/search-results/:carBrand/:carModel", carsController.searchCars)
    router.get("/bookingPage/:id", carsController.getOneCar)
    router.post('/bookings', bookingsController.addBooking)
    router.get('/bookings/:id', bookingsController.getBookedCar)

    app.use(router);
  };
   