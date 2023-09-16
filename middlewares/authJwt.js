const jwt = require("jsonwebtoken");
const db = require("../models/mysql")
const Users = db.users;

verifyToken = async (req, res, next) => {

  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw new Error("Authorization header not provided");
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, "mySecretKey");
    // req.user = await User.findById(decoded._id);
    const user = await Users.findByPk(decoded.id);
    // console.log("User found:", user);
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }

}

const authJwt = {
    verifyToken: verifyToken,
}

module.exports = authJwt;
