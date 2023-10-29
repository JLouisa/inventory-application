const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Manufacturer = require("../models/manufacturer");
const Hardware = require("../models/hardware");
const Category = require("../models/category");

//! GET all manufacturer page
exports.manufacturers = asyncHandler(async function (req, res, next) {
  const allManufacturer = await Manufacturer.find().exec();
  res.render("manufacturer", {
    title: "Manufacturers",
    text: "Welcome to our manufacturers page",
    allManufacturer: allManufacturer,
  });
});

//! GET manufacturer details page
exports.manufacturerDetails = asyncHandler(async function (req, res, next) {
  const theManufacturer = await Manufacturer.findById(req.params.id).exec();

  const allProducts = await Hardware.find({ manufacturer: theManufacturer._id }).populate("manufacturer").exec();

  res.render("manufacturer_details", {
    theManufacturer: theManufacturer,
    allProducts: allProducts ? allProducts : "No Products listed",
  });
});

//! GET manufacturer create form page
exports.manufacturerCreateGet = asyncHandler(async function (req, res, next) {
  const allCategories = await Category.find().exec();

  const newManufacturer = new Manufacturer({
    name: req.body.name || "",
    joinedDate: req.body.joinedDate || "",
    address: req.body.address || "",
    warranties: req.body.warranties || "",
  });

  res.render("forms/manufacturer_form", {
    title: "This is the Manufacturer Create GET page",
    oldManufacturer: newManufacturer,
    categories: allCategories,
  });
});

//! POST manufacturer create form page
exports.manufacturerCreatePost = [
  // Validate and sanitize the name field.
  body("name")
    .notEmpty()
    .withMessage("Name must not be empty")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters")
    .escape(),
  body("joinedDate").notEmpty().withMessage("Joined Date must not be empty").isDate().trim().escape(),
  body("address")
    .notEmpty()
    .withMessage("Address must not be empty")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage("Address must be between 1 and 40 characters")
    .escape(),
  body("warranties")
    .notEmpty()
    .withMessage("Warranty must not be empty")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Warranty must be between 1 and 150 characters")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const [theCategory, allCategories] = await Promise.all([
      Category.findById(req.body.category).exec(),
      Category.find().exec(),
    ]);

    console.log("req.body");
    console.log(req.body);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Create a genre object with escaped and trimmed data.
      const newManufacturer = new Manufacturer({
        name: req.body.name || "",
        joinedDate: req.body.joinedDate || "",
        address: req.body.address || "",
        warranties: req.body.warranties || "",
      });

      const new2Manufacturer = {
        name: req.body.name || "",
        joinedDate: req.body.joinedDate || "",
        address: req.body.address || "",
        warranties: {
          [theCategory.name]: req.body.warranties,
        },
      };

      console.log("Test Manufacturer");
      console.log(new2Manufacturer);

      // There are errors. Render the form again with sanitized values/error messages.
      res.render("forms/manufacturer_form", {
        title: "Location Form Submission Failed",
        text: "Please review and correct the following issues before submitting the form:",
        oldManufacturer: newManufacturer,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      // Create a genre object with escaped and trimmed data.
      const newManufacturer = new Manufacturer({
        name: req.body.name,
        joinedDate: req.body.joinedDate,
        address: req.body.address,
        warranties: {
          [theCategory.name]: req.body.warranties,
        },
      });

      console.log("Validation succesfull");
      console.log("Save new document");

      console.log("newManufacturer");
      console.log(newManufacturer);

      await newManufacturer.save();

      return res.redirect("../manufacturers");
    }
  }),
];

exports.manufacturerUpdateGet = asyncHandler(async function (req, res, next) {
  res.render("forms/manufacturer", { title: "This is the Manufacturer Update GET page" });
});

exports.manufacturerUpdatePost = asyncHandler(async function (req, res, next) {
  res.render("forms/manufacturer", { title: "This is the Manufacturer Update POST page" });
});

exports.manufacturerDeleteGet = asyncHandler(async function (req, res, next) {
  res.render("forms/manufacturer", { title: "This is the Manufacturer Delete GET page" });
});

exports.manufacturerDeletePost = asyncHandler(async function (req, res, next) {
  res.render("forms/manufacturer", { title: "This is the Manufacturer Delete POST page" });
});
