const mongoose = require('mongoose');
const CarFeatures = require('../models/mongodb/car_features');
const CarCategory = require('../models/mongodb/car_category');

// Your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://denis:1234@rentacar.vla9qqe.mongodb.net/Rent-a-car';

const features = [
    { feature_name: "GPS Navigation" },
    { feature_name: "Air Suspension" },
    { feature_name: "360 Camera" },
    { feature_name: "Cruise Control" },
    { feature_name: "Autonomous Parking" },
    { feature_name: "Massage Seats" },
    { feature_name: "Sunroof" },
    { feature_name: "3 zone climate control" },
    { feature_name: "Apple CarPlay" },
    { feature_name: "Android Auto" }
];

const categories = [
    { category_name: "Sedan" },
    { category_name: "SUV" },
    { category_name: "Hatchback" },
    { category_name: "Coupe" },
    { category_name: "Wagon" },
    { category_name: "Convertible" }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await CarFeatures.deleteMany({});
        await CarCategory.deleteMany({});

        const insertedFeatures = await CarFeatures.insertMany(features, { ordered: false })
            .catch(error => {
                console.log('Some features may already exist:', error.message);
                return error.insertedDocs || [];
            });

        const insertedCategories = await CarCategory.insertMany(categories, { ordered: false })
            .catch(error => {
                console.log('Some categories may already exist:', error.message);
                return error.insertedDocs || [];
            });



        const totalFeatures = await CarFeatures.countDocuments();
        const totalCategories = await CarCategory.countDocuments();


    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {

        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};


seedDatabase();