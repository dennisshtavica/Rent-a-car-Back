const mongoose = require("mongoose");

const Bookings = mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cars",
        required: true,
    },
    userId: {  
        type: String,
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
    booking_status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: "Pending" 
    }, 
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
}, {
    timestamps: true 
});

module.exports = mongoose.model("Bookings", Bookings, 'bookings');