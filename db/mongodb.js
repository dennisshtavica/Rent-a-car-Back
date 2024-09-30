const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bledor:bledi12@rentacar.vla9qqe.mongodb.net/Rent-a-car', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => {
      console.log('Connected to MongoDB successfully.');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

module.exports = mongoose.connection;