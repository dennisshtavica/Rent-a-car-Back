const mongoose = require("mongoose");

const CarCategory = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true         // Ensures no duplicate categories
    }
});

module.exports = mongoose.model("CarCategory", CarCategory, 'car_category');