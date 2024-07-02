const Sequelize = require("sequelize");

// const sequelize = new Sequelize('rentacar', 'root', '1234', {
//     host: 'localhost',
//     dialect: 'mysql'
// })

const sequelize = new Sequelize("rentacar", "root", "", {
  host: "127.0.0.8",
  dialect: "mysql",
  port: 3307,
});

module.exports = sequelize;
