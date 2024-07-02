const router = require("express").Router();
const usersController = require("../controllers/usersController");
const magazineController = require("../controllers/magazineController");
const publisherController = require("../controllers/publisherContrller");

const {authJwt} = require('../middlewares')

module.exports = (app) => {
  // app.use(function (req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );

  //   next();
  // });

  router.post("/signup", usersController.signup);
  router.post("/login", usersController.login);
  router.get("/users/edit/:id", [authJwt.verifyToken], usersController.getOneUser)
  router.put('/users/edit/:id', [authJwt.verifyToken], usersController.editUser)

  router.post("/newMagazine", magazineController.createMagazine);
  router.get("/publisher", publisherController.getPublisher);
  router.post('/newPublisher', publisherController.newPublisher)
  router.get("/getMagazines", magazineController.getMagazines)
  router.put('/deletePublisher/:id', publisherController.deletePublisher)
  router.put('/deleteMagazine/:id', magazineController.deleteMagazine)
 
  app.use(router);
};
