const Bookings = require("../models/mongodb/bookings");
const db = require("../models/mysql");
const User = db.users;
const Car = require("../models/mongodb/cars");
const {format} = require('date-fns');

exports.addBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, pickupDate, returnDate, userId } = req.body;

    const newBooking = new Bookings({
      carId,
      pickupLocation,
      pickupDate,
      returnDate,
    });

    const savedBooking = await newBooking.save();

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let carsRented = [];
    if (user.carsRented) {
      carsRented = JSON.parse(user.carsRented);
    }

    carsRented.push(savedBooking._id.toString());
    user.carsRented = JSON.stringify(carsRented);

    await user.save();

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getBookedCar = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user data from MySQL
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse the carsRented string to get the array of booking IDs
    let bookingIds = [];
    if (user.carsRented) {
      bookingIds = JSON.parse(user.carsRented);
    }

    // Fetch booking details from MongoDB
    const bookings = await Bookings.find({ _id: { $in: bookingIds } });

    // Extract car IDs from the booking details
    const carIds = bookings.map(booking => booking.carId);

    // Fetch car details from MongoDB
    const cars = await Car.find({ _id: { $in: carIds } });

    // Combine the car details with the booking details
    const bookedCarsWithDetails = bookings.map(booking => {
      const carDetails = cars.find(car => car._id.equals(booking.carId));
      const pickupDateFormatted = format(new Date(booking.pickupDate), 'dd MMM yyyy');
      const returnDateFormatted = format(new Date(booking.returnDate), 'dd MMM yyyy');
      const formattedDates = `${pickupDateFormatted} - ${returnDateFormatted}`;

      return {
        bookingId: booking._id,
        car: carDetails,
        pickupLocation: booking.pickupLocation,
        formattedDates,
      };
    });

    // Send the combined details back as a response
    res.status(200).json(bookedCarsWithDetails);
  } catch (error) {
    console.error("Error fetching booked cars:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookingId = req.params.bookingId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let bookingIds = [];
    if (user.carsRented) {
      bookingIds = JSON.parse(user.carsRented);
    }

    if (!bookingIds.includes(bookingId)) {
      return res.status(404).json({ message: "Booking not found for this user" });
    }

    bookingIds = bookingIds.filter(id => id !== bookingId);
    user.carsRented = JSON.stringify(bookingIds);

    await user.save();

    await Bookings.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};