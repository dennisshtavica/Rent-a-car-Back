const mongoose = require('mongoose');
const Bookings = require("../models/mongodb/bookings");
const db = require("../models/mysql");
const User = db.users;
const Car = require("../models/mongodb/cars");
const {format} = require('date-fns');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//webhoookin e kom bo veq ki me implementu, se smujta, kqyre a esht mir just in case e fundit esht

exports.getAllBookings = async (req, res) => {
  try {
      console.log('1. Starting getAllBookings');
      
      const bookings = await Bookings.find({}).lean();
      console.log('2. Found bookings:', bookings); 

      if (!bookings || bookings.length === 0) {
          return res.status(200).json([]);
      }

      const carIds = bookings.map(booking => booking.carId).filter(id => id);
      const cars = await Car.find({ _id: { $in: carIds } }).lean();

      const userIds = bookings.map(booking => booking.userId).filter(id => id);
      const users = await User.findAll({
          where: {
              id: userIds
          },
          attributes: ['id', 'username', 'email']
      });

      const userMap = users.reduce((acc, user) => {
          acc[user.id] = user.toJSON();
          return acc;
      }, {});

      const carMap = cars.reduce((acc, car) => {
          acc[car._id.toString()] = car;
          return acc;
      }, {});

      const bookingsWithDetails = bookings.map(booking => {
          const car = carMap[booking.carId?.toString()] || {
              brand: 'Unknown',
              model: 'Unknown',
              image: 'default-car.jpg'
          };

          const user = userMap[booking.userId] || {
              username: 'Unknown User',
              email: 'unknown@email.com'
          };

          let rentalDate = {
              from: new Date(),
              to: new Date()
          };

          try {
              if (booking.rentalDate && booking.rentalDate.from && booking.rentalDate.to) {
                  rentalDate = {
                      from: new Date(booking.rentalDate.from),
                      to: new Date(booking.rentalDate.to)
                  };
              }
          } catch (error) {
              console.error('Error parsing dates for booking:', booking._id, error);
          }

          return {
              _id: booking._id,
              booking_status: booking.booking_status || 'Unknown',
              pickupLocation: booking.pickupLocation || 'Not specified',
              returnLocation: booking.returnLocation || 'Not specified',
              rentalDate: rentalDate,
              totalAmount: booking.totalAmount || 0,
              car: {
                  brand: car.brand || 'Unknown',
                  model: car.model || 'Unknown',
                  image: car.image || 'default-car.jpg'
              },
              user: {
                  username: user.username || 'Unknown User',
                  email: user.email || 'unknown@email.com'
              }
          };
      });

      res.status(200).json(bookingsWithDetails);

  } catch (error) {
      console.error('Error in getAllBookings:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
          message: "Error fetching all bookings",
          error: error.message
      });
  }
};


exports.addBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, returnLocation, rentalDate, userId } = req.body;

    const newBooking = new Bookings({
      carId,
      userId,
      pickupLocation,
      returnLocation,
      rentalDate,
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
    console.log('1. Received request for userId:', userId);

    console.log('2. Searching for bookings with userId:', userId);
    const bookings = await Bookings.find({ userId: userId });
    console.log('3. Found bookings:', JSON.stringify(bookings, null, 2));

    if (!bookings || bookings.length === 0) {
      console.log('4. No bookings found for user');
      return res.status(200).json([]);
    }

    const carIds = bookings.map(booking => booking.carId);
    console.log('5. Extracted carIds:', carIds);

    const cars = await Car.find({ _id: { $in: carIds } });
    console.log('6. Found cars:', JSON.stringify(cars, null, 2));

    const bookedCarsWithDetails = bookings.map(booking => {
      const carDetails = cars.find(car => car._id.equals(booking.carId));
      console.log('7. Processing booking:', booking._id, 'with car:', carDetails?._id);

      let formattedDates;
      try {
        const fromDateFormatted = format(new Date(booking.rentalDate.from), 'dd MMM yyyy');
        const toDateFormatted = format(new Date(booking.rentalDate.to), 'dd MMM yyyy');
        formattedDates = `${fromDateFormatted} - ${toDateFormatted}`;
      } catch (error) {
        console.error('8. Error formatting dates for booking:', booking._id, error);
        formattedDates = 'Date format error';
      }

      return {
        bookingId: booking._id,
        car: carDetails || { brand: 'Unknown', model: 'Unknown' },
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
        formattedDates,
        status: booking.booking_status
      };
    });

    console.log('9. Sending response:', JSON.stringify(bookedCarsWithDetails, null, 2));
    res.status(200).json(bookedCarsWithDetails);

  } catch (error) {
    console.error("10. Error in getBookedCar:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      message: "Error fetching booked cars", 
      error: error.message,
      stack: error.stack
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
      const { userId, bookingId } = req.params;
      console.log('Deleting booking:', { userId, bookingId });

      const objectId = new mongoose.Types.ObjectId(bookingId);

      const result = await Bookings.findOneAndDelete({ 
          _id: objectId,
          userId: userId 
      });

      if (!result) {
          return res.status(404).json({
              message: "Booking not found"
          });
      }

      res.status(200).json({
          message: "Booking deleted successfully"
      });

  } catch (error) {
      console.error('Error in cancelBooking:', error);
      res.status(500).json({
          message: "Error deleting booking",
          error: error.message
      });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find({});
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { 
      amount, 
      carName, 
      carId, 
      pickupLocation, 
      returnLocation, 
      rentalDate, 
      username, 
      email, 
      phone_number,
      userId 
    } = req.body;

    const formattedRentalDate = {
      from: new Date(rentalDate.from),
      to: new Date(rentalDate.to),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: carName,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    const booking = new Bookings({
      carId,
      userId, 
      pickupLocation,
      returnLocation,
      rentalDate: formattedRentalDate, 
      booking_status: 'Pending',
      username,
      email,
      phone_number,
    });

    const savedBooking = await booking.save();

    const user = await User.findByPk(userId);
    if (user) {
      let carsRented = [];
      try {
        carsRented = user.carsRented ? JSON.parse(user.carsRented) : [];
      } catch (e) {
        console.error('Error parsing carsRented:', e);
      }

      carsRented.push(savedBooking._id.toString());
      user.carsRented = JSON.stringify(carsRented);
      await user.save();
    }

    res.json({ 
      url: session.url,
      bookingId: savedBooking._id 
    });
  } catch (error) {
    console.error('Error creating checkout session or saving booking:', error);
    res.status(500).json({
      message: 'Error creating checkout session or saving booking',
      error: error.message,
    });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const booking = await Bookings.findOne({
        carId: session.metadata.carId,
        userId: session.metadata.userId,
        booking_status: 'Pending'
      });

      if (booking) {
        booking.booking_status = 'Confirmed';
        await booking.save();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  }

  res.json({ received: true });
};