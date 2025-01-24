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
    returnLocation: {
        type: String,         
        required: true        
    },
    rentalDate: {
        from: { type: Date, required: true }, 
        to: { type: Date, required: true },   
      },
    booking_status: { type: String, default: "pending" }, 
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    // booking_status: {
    //     type: String,         
    //     enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    //     default: 'pending',   
    //     required: true        
    // }
})

module.exports = mongoose.model("Bookings", Bookings, 'bookings')