const Cars = require("../models/mongodb/cars");
const path = require("path");
const CarCategory = require("../models/mongodb/car_category");
const CarFeatures = require("../models/mongodb/car_features");


exports.addCar = async (req, res) => {
  try {
    // Parse the JSON strings if they're coming as strings
    const carFeatures = Array.isArray(req.body.car_features) 
      ? req.body.car_features 
      : JSON.parse(req.body.car_features);
    
    const carCategory = Array.isArray(req.body.car_category)
      ? req.body.car_category
      : JSON.parse(req.body.car_category);

    const newCar = new Cars({
      brand: req.body.brand,
      model: req.body.model,
      image: req.file.path,
      seats: req.body.seats,
      transmission: req.body.transmission,
      price: req.body.price,
      year: req.body.year,
      available: req.body.available,
      fuelType: req.body.fuelType,
      car_features: carFeatures,
      car_category: carCategory,
    });

    const savedCar = await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: savedCar });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.deleteCars = (req, res, next) => {
  Cars.deleteMany({})
      .then(() => {
        console.log("Deleted cars");
        next();
      })
      .catch((err) => {
        console.log("Err", err);
      });
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Cars.find({})
      .populate({
        path: "car_category", 
        select: "category_name", 
      })
      .populate({
        path: "car_features", 
        select: "feature_name", 
      });

    res.status(200).json(cars);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.searchCars = async (req, res) => {
  try {
    const { carBrand, carModel } = req.params;

    const searchResults = await Cars.find({ name: carBrand, model: carModel });

    res.status(200).json({ results: searchResults });
  } catch (error) {
    console.error("Error searching cars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOneCar = (req, res) => {
  let carId = req.params.id;

  Cars.findById(carId)
      .then((car) => {
        console.log(car);
        res.status(200).json(car);
      })
      .catch((err) => {
        console.log('Err', err);
      });
};

//new added to get distinct car brands
exports.getCarBrands = (req, res) => {
  Cars.distinct("name")
      .then((carBrands) => {
        res.status(200).json(carBrands);
      })
      .catch((error) => {
        console.error("Error fetching car brands:", error);
        res.status(500).json({ error: "Internal server error" });
      });
};

// new added to get models for a specific car brand
exports.getCarModels = (req, res) => {
  const { brand } = req.params;

  Cars.find({ name: brand })
      .select("model")
      .then((cars) => {
        const models = [...new Set(cars.map((car) => car.model))];
        res.status(200).json(models);
      })
      .catch((error) => {
        console.error("Error fetching car models:", error);
        res.status(500).json({ error: "Internal server error" });
      });
};
