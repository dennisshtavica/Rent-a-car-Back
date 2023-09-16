const db = require("../models/mysql");
const jwt = require("jsonwebtoken");
const User = db.users;

exports.signup = async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const userExist = await User.findOne({
    where: { email: req.body.email },
  });

  if (userExist) {
    return res.json({
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
              res.status(200).json({ message: "ok", token, username: user.username});
            } else {
              console.log("Error");
            }
            next();
          }
          );
        } else {
          next();
        }
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  };
  