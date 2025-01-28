const mongoose = require('mongoose');

const Payments = mongoose.Schema({
    payment_id: {
        type: String,
        required: true,
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bookings', 
        required: true
    },
    user_id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
    payment_method: {
        type: String,
    },
    created_at: { type: Date, default: Date.now }, 
    updated_at: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Payments', Payments, 'payments');