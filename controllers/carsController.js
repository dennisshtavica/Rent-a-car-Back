const Cars = require("../models/mongodb/cars");
const path = require("path");


exports.addCar = async (req, res) => {
  const newCar = new Cars({
    name: req.body.name,
    model: req.body.model,
    image: req.file.path,
    seats: req.body.seats,
    transmission: req.body.transmission,
    range: req.body.range,
    type: req.body.type,
    price: req.body.price,
  });

  newCar
      .save()
      .then((car) => {
        res.status(201).json({ message: "Car added successfully", car });
      })
      .catch((error) => {
        console.error("Error adding car:", error);
        res.status(500).json({ error: "Internal server error" });
      });
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

exports.getCars = (req, res, next) => {
  Cars.find({})
      .then((cars) => {
        res.status(200).send(cars);
        next();
      })
      .catch((err) => {
        console.log("Err", err);
      });
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
