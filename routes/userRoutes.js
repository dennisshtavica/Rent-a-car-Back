const router = require("express").Router();
const usersController = require("../controllers/usersController")

const { authJwt } = require("../middlewares/authJwt");


module.exports = (app) => {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
  
      next();
    });
  
    router.post("/signup", usersController.signup)
    router.post("/login", usersController.login)

    app.use(router);
  };
   