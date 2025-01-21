const mongoose = require("mongoose");

const Cars = mongoose.Schema({
    brand: {
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
    price: {
        type: Number,
        required: true
    },
    year: {
        type: Number,          
        required: true         
    },
    available: {
        type: Boolean,           
        default: true            
    },
    fuelType: {
        type: String,
        required: true
    },
    car_features: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarFeatures',
        required: true        
    }],
    car_category: [{
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'CarCategory',
        required: true
    }]
})

module.exports = mongoose.model("Cars", Cars, 'cars')