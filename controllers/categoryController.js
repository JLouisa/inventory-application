const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Hardware = require("../models/hardware");
const Category = require("../models/category");

//! GET all category page
exports.category = asyncHandler(async function (req, res, next) {
  const allCategory = await Category.find().exec();
  res.render("category", {
    title: "Category",
    text: "Welcome to our categories",
    category: allCategory,
  });
});

//! GET category details page
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

//! GET category create form page
exports.categoryCreateGet = asyncHandler(async function (req, res, next) {
  const newCategory = new Category({
    name: req.body.name || "",
    description: req.body.description || "",
  });

  res.render("forms/category_form", {
    title: "This is the Category Create GET page",
    oldCategory: newCategory,
  });
});

//! POST category create form page
exports.categoryCreatePost = [
  // Validate and sanitize the name field.
  body("name")
    .notEmpty()
    .withMessage("Name must not be empty")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters")
    .escape(),
  body("description")
    .notEmpty()
    .withMessage("Description must not be empty")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Description must be between 1 and 150 characters")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    console.log("req.body");
    console.log(req.body);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newCategory = new Category({
      name: req.body.name || "",
      description: req.body.description || "",
    });

    if (!errors.isEmpty()) {
      // Create a genre object with escaped and trimmed data.
      console.log("Test Manufacturer");
      console.log(newCategory);

      // There are errors. Render the form again with sanitized values/error messages.
      res.render("forms/category_form", {
        title: "Location Form Submission Failed",
        text: "Please review and correct the following issues before submitting the form:",
        oldCategory: newCategory,
        errors: errors.array(),
      });
      return;
    } else {
      // Create a genre object with escaped and trimmed data.
      console.log("Validation succesfull");
      console.log("Save new document");

      console.log("newManufacturer");
      console.log(newCategory);

      await newCategory.save();

      return res.redirect("../category");
    }
  }),
];

exports.categoryUpdateGet = asyncHandler(async function (req, res, next) {
  res.render("dev", { title: "This is the Category Update GET page" });
});

exports.categoryUpdatePost = asyncHandler(async function (req, res, next) {
  res.render("dev", { title: "This is the Category Update POST page" });
});

exports.categoryDeleteGet = asyncHandler(async function (req, res, next) {
  res.render("dev", { title: "This is the Category Delete GET page" });
});

exports.categoryDeletePost = asyncHandler(async function (req, res, next) {
  res.render("dev", { title: "This is the Category Delete POST page" });
});
