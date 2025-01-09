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
    year: {
        type: Number,          
        required: true         
    },
    available: {
        type: Boolean,           
        default: true            
    },
    car_features: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarFeature'        
    }],
    car_category: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'CarCategory',
        required: true
    }
})

module.exports = mongoose.model("Cars", Cars, 'cars')