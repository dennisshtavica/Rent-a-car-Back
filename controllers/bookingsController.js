const Bookings = require("../models/mongodb/bookings");

exports.addBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, pickupDate, returnDate } = req.body;

    const newBooking = new Bookings({
      carId,
      pickupLocation,
      pickupDate,
      returnDate,
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBookedCar = async (req, res) => {
  try {
    let bookingId = req.params.id;

    const bookedCar = await Bookings.findById(bookingId)
      .populate("carId") 
      .exec();

      if (!bookedCar) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.status(200).json(bookedCar);

  } catch (err) {
    console.log("Err", err);
  }
};
