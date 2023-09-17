const mongoose = require("mongoose");

const Cars = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    seats: {
        type: Number,
        required: true,
    },
    transmission: {
        type: String,
        required: true,
    },
    range: {
        type: String,
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model("Cars", Cars, 'cars')