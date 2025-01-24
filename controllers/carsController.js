const Cars = require("../models/mongodb/cars");
const path = require("path");
const CarCategory = require("../models/mongodb/car_category");
const CarFeatures = require("../models/mongodb/car_features");


exports.addCar = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    const carFeatures = req.body.car_features || [];
    const features = Array.isArray(carFeatures) ? carFeatures : [carFeatures];

    if (!req.body.brand || !req.body.model || !req.file || !req.body.car_category) {
      return res.status(400).json({ 
        error: "Missing required fields",
        received: {
          brand: req.body.brand,
          model: req.body.model,
          file: req.file,
          category: req.body.car_category,
          features: features
        }
      });
    }

    const newCar = new Cars({
      brand: req.body.brand,
      model: req.body.model,
      image: req.file.path,
      seats: Number(req.body.seats),
      transmission: req.body.transmission,
      price: Number(req.body.price),
      year: Number(req.body.year) || new Date().getFullYear(),
      available: true,
      fuelType: req.body.fuelType,
      car_features: features,
      car_category: req.body.car_category
    });

    console.log('Attempting to save car:', newCar);

    const savedCar = await newCar.save();
    console.log('Car saved successfully:', savedCar);

    const populatedCar = await Cars.findById(savedCar._id)
      .populate('car_features')
      .populate('car_category');

    res.status(201).json({ 
      message: "Car added successfully", 
      car: populatedCar 
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message,
      stack: error.stack 
    });
  }
};

exports.updateCar = async (req, res) => {
  try {
    console.log('Update request for car:', req.params.id);
    console.log('Update data:', req.body);

    const carId = req.params.id;
    
    const updateData = {
      brand: req.body.brand,
      model: req.body.model,
      seats: Number(req.body.seats),
      transmission: req.body.transmission,
      price: Number(req.body.price),
      year: Number(req.body.year),
      fuelType: req.body.fuelType,
      car_features: Array.isArray(req.body['car_features[]']) 
        ? req.body['car_features[]'] 
        : [req.body['car_features[]']],
      car_category: req.body.car_category
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedCar = await Cars.findByIdAndUpdate(
      carId,
      updateData,
      { new: true, runValidators: true }
    ).populate('car_features').populate('car_category');

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({
      message: "Car updated successfully",
      car: updatedCar
    });

  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({
      error: "Error updating car",
      details: error.message
    });
  }
};

exports.getFeatures = async (req, res) => {
  try {
      const features = await CarFeatures.find();
      res.status(200).json(features);
  } catch (error) {
      console.error('Error fetching features:', error);
      res.status(500).json({ 
          message: 'Error fetching features',
          error: error.message 
      });
  }
};

exports.getCategories = async (req, res) => {
  try {
      const categories = await CarCategory.find();
      res.status(200).json(categories);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
          message: 'Error fetching categories',
          error: error.message 
      });
  }
};


exports.deleteCars = (req, res) => {
  const { carId } = req.body;
  
  Cars.findByIdAndDelete(carId)
    .then(() => {
      res.status(200).json({ message: "Car deleted successfully" });
    })
    .catch((err) => {
      console.log("Err", err);
      res.status(500).json({ message: "Error deleting car", error: err });
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

exports.deleteCar = async (req, res) => {
  try {
    const carId = req.params.id;
    
    const deletedCar = await Cars.findByIdAndDelete(carId);
    
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ 
      message: "Car deleted successfully",
      deletedCar 
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ 
      message: "Error deleting car", 
      error: error.message 
    });
  }
};
