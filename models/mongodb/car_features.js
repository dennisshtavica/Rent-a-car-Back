const mongoose = require("mongoose");

const CarFeatures = new mongoose.Schema({
    feature_name: {
        type: String,
        required: true,   
        unique: true       
    }
});

module.exports = mongoose.model("CarFeatures", CarFeatures, 'car_features');
