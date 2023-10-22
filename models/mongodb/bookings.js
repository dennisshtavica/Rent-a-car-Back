const mongoose = require("mongoose");

const Bookings = mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cars",
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model("Bookings", Bookings, 'bookings')