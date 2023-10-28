const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Welcome to the Computer Parts Shop.",
  });
});

/* GET category page. */
router.get("/category", categoryController.category);

/* GET manufacturer page. */
router.get("/manufacturer", function (req, res, next) {
  res.render("manufacturer", {
    title: "Here goes the manufacturer",
  });
});

/* GET locations page. */
router.get("/locations", function (req, res, next) {
  res.render("locations", {
    title: "Here goes the locations",
  });
});

module.exports = router;
