const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Hardware = require("../models/hardware");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");
const Location = require("../models/locations");

exports.category = asyncHandler(async function (req, res, next) {
  const allCategory = await Category.find().exec();
  res.render("category", {
    title: "Category",
    text: "Welcome to our categories",
    category: allCategory,
  });
});

exports.categoryDetails = asyncHandler(async function (req, res, next) {
  const theCategory = await Category.findById(req.params.id).exec();
  if (!theCategory) {
    // Handle the case when the category is not found
    return res.status(404).send("Category not found");
  }

  const allProducts = await Hardware.find({ category: theCategory._id })
    .populate("category") // Replace "Category" with "category"
    .exec();

  res.render("category_details", {
    category: theCategory,
    products: allProducts,
  });
});
