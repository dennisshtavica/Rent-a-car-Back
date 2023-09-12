const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../../db/mysql");

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the MySQL database:", err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



module.exports = db;
