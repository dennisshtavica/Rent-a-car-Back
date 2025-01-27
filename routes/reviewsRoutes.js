const router = require("express").Router();
const reviewsController = require("../controllers/reviewsController");
const { authJwt, multerMiddleware } = require("../middlewares/index");
const express = require('express');

module.exports = (app) => {
   router.post("/reviews/add", [authJwt.verifyToken], reviewsController.addReview);
   router.get("/reviews", reviewsController.getReviews);
   router.delete("/reviews/:reviewId", [authJwt.verifyToken], reviewsController.deleteReview);
   
   app.use(router);
};