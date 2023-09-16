module.exports = (sequelize, DataTypes) => {
  const bcrypt = require("bcrypt");

  const User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,  
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  }, 
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
  );
  
  User.beforeCreate(async (user, options) => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    } catch (error) {
      console.log(`Error in hashing password: ${error.message}`);
      throw error;
    }
  });

  User.prototype.passwordComparison = async function (inputPassword) {
    try {
      return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
      console.log(`Error in password comparison: ${error.message}`);
      throw error;
    }
  };

  return User;
};
