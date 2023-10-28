const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Hardware = require("../models/hardware");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

exports.category = asyncHandler(async function (req, res, next) {
  const allCategory = await Category.find().exec();
  res.render("category", {
    title: "Category",
    text: "Welcome to our categories",
    category: allCategory,
  });
});
