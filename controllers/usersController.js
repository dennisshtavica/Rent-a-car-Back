const db = require("../models/mysql");
const jwt = require("jsonwebtoken");
const User = db.users;
const bcrypt = require("bcrypt");
const { sequelize } = require("../models/mysql");


exports.signup = async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
  };

  if (!user.username || !user.email || !user.password || !user.phone_number) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!passwordRegex.test(user.password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one number and one uppercase letter",
    });
  }

  const userExist = await User.findOne({
    where: { email: req.body.email },
  });

  if (userExist) {
    return res.status(400).json({
      message: "User already exist with the given emailId",
    });
  }

  User.create(user)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(`Error creating user: ${err.message}`);
    });

  console.log(user);
  const token = jwt.sign({ id: user.id }, "mySecretKey", {
    expiresIn: "24h",
  });

  user.token = token;

  console.log(token);
};


exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    // const jwtSecret = process.env.SECRET_KEY ;

    if (!req.body.email) {
      res.status(400).json({ message: "Email is required" });
    }
    if(!req.body.password) {
      res.status(400).json({ message: "Password is required" });
    }


    if (user) {
      const passwordMatch = await user.passwordComparison(req.body.password);

      if (passwordMatch) {
        const query = `
          SELECT users.*, roles.name AS role_name
          FROM users
          LEFT JOIN roles ON users.role_id = roles.id
          WHERE users.email = :email;
        `;

        const [result] = await sequelize.query(query, {
          replacements: { email: req.body.email },
          type: sequelize.QueryTypes.SELECT,
        });

        if (result) {
          const payload = {
            id: result.id,
            role_id: result.role_id,
            role_name: result.role_name,
          };

          const token = jwt.sign(payload, "mySecretKey", {
            expiresIn: "24h",
          });

          req.user = user;
          res.status(200).json({
            message: "ok",
            token,
            role_id: result.role_id,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            id: user.id,
          });
        } else {
          console.log("Error fetching user and role information");
        }
      } else {
        console.log("Error");
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      next();
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};


exports.editUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, phone_number, role_id } = req.body;

  if (!username || !email || !phone_number || !role_id) {
    return res
      .status(400)
      .json({ message: "All fields are required (username, email, phone_number, role_id)" });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const userExist = await User.findOne({
        where: { email: email },
      });

      if (userExist) {
        return res.status(400).json({
          message: "User already exists with the given email",
        });
      }
    }

    // Only hash password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.username = username;
    user.email = email;
    user.phone_number = phone_number;
    user.role_id = role_id;

    await user.save();

    res.json({ 
      message: "User updated successfully", 
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role_id: user.role_id
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

exports.getOneUser = (req, res) => {
  let id = req.params.id;

  User.findOne({ where: { id: id } })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(`Error fetching user by ID: ${err.message}`);
    });
};

exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log(`Error fetching all users: ${err.message}`);
    });
};

exports.createUser = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
      role_id: req.body.role_id
    };

    if (!user.username || !user.email || !user.password || !user.phone_number || !user.role_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (username, email, password, phone_number, role_id)",
      });
    }

    const userExist = await User.findOne({
      where: { email: user.email },
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists with the given email",
      });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const newUser = await User.create(user);

    // Send response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        role_id: newUser.role_id,
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phone_number,
        id: newUser.id
      }
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};