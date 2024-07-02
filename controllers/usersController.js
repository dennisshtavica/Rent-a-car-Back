const db = require("../models/mysql");
const jwt = require("jsonwebtoken");
const User = db.users;
const bcrypt = require("bcrypt");


exports.signup = async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  if (!user.username || !user.email || !user.password) {
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

exports.login = (req, res, next) => {
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (user) {
        user.passwordComparison(req.body.password).then((passwordMatch) => {
          if (passwordMatch) {
            console.log(`Success ${user.name}`);
            const payload = { id: user.id };
            const token = jwt.sign(payload, "mySecretKey", {
              expiresIn: "24h",
            });
            req.user = user;
            res
              .status(200)
              .json({
                message: "ok",
                token,
                username: user.username,
                email: user.email,
                id: user.id,
              });
          } else {
            console.log("Error");
            res.status(401).json({ message: "Invalid credentials" });
          }
          next();
        });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};


exports.editUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Name and role_id are required for the update" });
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

    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "User updated successfully", user });
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