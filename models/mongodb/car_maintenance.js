const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carMaintenanceSchema = new Schema({
   car_id: {
       type: Schema.Types.ObjectId,
       ref: 'Cars',
       required: true
   },
   service_date: {
       type: Date,
       required: true
   },
   service_type: {
       type: String,
       required: true
   },
   mileage: {
       type: Number,
       required: true
   },
   mechanic: {
       type: String,
       required: true
   },
   issues_found: [{
       type: String
   }],
   fixed: {
       type: Boolean,
       default: false
   }
}, {
   timestamps: true
});
module.exports = mongoose.model('CarMaintenance', carMaintenanceSchema, 'carmaintenances');