const CarMaintenance = require("../models/mongodb/car_maintenance");
const Cars = require("../models/mongodb/cars");

exports.getMaintenanceRecords = async (req, res) => {
   try {
       let query = {};
       
       if (req.query.carIds) {
           const carIds = req.query.carIds.split(',');
           query.car_id = { $in: carIds };
       }
        const maintenanceRecords = await CarMaintenance.find(query)
           .sort({ service_date: -1 })
           .populate({
               path: 'car_id',
               model: 'Cars',
               select: 'brand model year'
           });
        return res.status(200).json({
           success: true,
           data: maintenanceRecords
       });
    } catch (error) {
       console.error('Error in getMaintenanceRecords:', error);
       return res.status(500).json({
           success: false,
           message: 'Error fetching maintenance records',
           error: error.message
       });
   }
};

exports.getCarMaintenanceById = async (req, res) => {
   try {
       const { carId } = req.params;
       
       const maintenanceRecords = await CarMaintenance.find({ car_id: carId })
           .sort({ service_date: -1 })
           .populate({
               path: 'car_id',
               model: 'Cars',
               select: 'brand model year'
           });
        if (!maintenanceRecords.length) {
           return res.status(200).json({
               success: true,
               data: [],
               message: 'No maintenance records found for this car'
           });
       }
        return res.status(200).json({
           success: true,
           data: maintenanceRecords
       });
    } catch (error) {
       console.error('Error fetching maintenance records:', error);
       return res.status(500).json({
           success: false,
           message: 'Error fetching maintenance records',
           error: error.message
       });
   }
};

exports.addMaintenanceRecord = async (req, res) => {
   try {
       
       const maintenanceRecord = new CarMaintenance({
           car_id: req.body.car_id,
           service_date: req.body.service_date,
           service_type: req.body.service_type,
           mileage: req.body.mileage,
           mechanic: req.body.mechanic,
           issues_found: req.body.issues_found,
           fixed: req.body.fixed
       });
        const savedRecord = await maintenanceRecord.save();
        res.status(201).json({
           success: true,
           data: savedRecord
       });
   } catch (error) {
       console.error('Error adding maintenance record:', error);
       res.status(500).json({
           success: false,
           message: error.message
       });
   }
};