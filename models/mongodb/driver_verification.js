const mongoose = require('mongoose');

const DriverVerification = mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true
  },
  license_number: {
    type: String,
    required: true
  },
  expiration_date: {
    type: Date,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verification_date: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DriverVerification", DriverVerification, 'driver_verifications');
