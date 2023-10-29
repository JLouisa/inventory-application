const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Hardware = require("../models/hardware");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");
const Locations = require("../models/locations");
const { v4: uuidv4 } = require("uuid");

// Display list of all books.
exports.catalog = asyncHandler(async function (req, res, next) {
  const allHardware = await Hardware.find().exec();
  res.render("hardware", {
    title: "Catalog",
    text: "Welcome to our catalog",
    hardware: allHardware,
  });
});

//! GET Request for products product details
exports.product = asyncHandler(async function (req, res, next) {
  const hardware = await Hardware.findById(req.params.id).populate("manufacturer").populate("category").exec();
  res.render("hardware_details", {
    title: hardware.name,
    text: hardware.description,
    category: hardware.category,
    specifications: hardware.specifications,
    warranty: hardware.warrantyInformation,
    manufacturer: hardware.manufacturer,
    price: Number(hardware.price).toFixed(2),
    stock: hardware.numberInStock,
  });
});

//! GET - Display form to create hardware
exports.hardwareCreateGet = asyncHandler(async function (req, res, next) {
  const [allManufacturer, allCategory, allLocations] = await Promise.all([
    Manufacturer.find().exec(),
    Category.find().exec(),
    Locations.find().exec(),
  ]);

  const newHardware = new Hardware({
    name: req.body.name || "",
    manufacturer: req.body.manufacturer || "",
    description: req.body.description || "",
    category: req.body.category || "",
    price: req.body.price || 0,
    numberInStock: req.body.numberInStock || 0,
    sku: uuidv4(),
    specifications: req.body.specifications || "",
    locations: req.body.locations || "",
  });

  res.render("forms/hardware_form", {
    title: "Hardware Form",
    text: "Welcome to our hardware forms",
    manufacturers: allManufacturer,
    categories: allCategory,
    locations: allLocations,
    oldHardware: newHardware,
  });
});

//! POST - Create Hardware
// Handle Genre create on POST.
exports.hardwareCreatePost = [
  // Validate and sanitize the name field.
  body("name")
    .notEmpty()
    .withMessage("Name must not be empty")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters")
    .escape(),
  body("manufacturer").notEmpty().withMessage("Manufacturer must not be empty").trim().escape(),
  body("description")
    .notEmpty()
    .withMessage("Description must not be empty")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Description must be between 3 and 20 characters")
    .escape(),
  body("category").notEmpty().withMessage("Category must not be empty").trim().escape(),
  body("price")
    .notEmpty()
    .withMessage("Price must not be empty")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Price must be between 1 and 10 characters")
    .escape(),
  body("specifications")
    .notEmpty()
    .withMessage("Specifications must not be empty")
    .trim()
    .withMessage("Specifications must be between 3 and 20 characters")
    .isLength({ min: 3, max: 150 })
    .withMessage("Specifications must be between 3 and 150 characters")
    .escape(),
  body("locations").notEmpty().withMessage("Locations must not be empty").trim().escape(),
  body("numberInStock")
    .notEmpty()
    .withMessage("Number In Stock must not be empty")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Number In Stock must be between 1 and 10 characters")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    console.log(req.body);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const newHardware = {
      name: req.body.name || "",
      manufacturer: req.body.manufacturer || "",
      description: req.body.description || "",
      category: req.body.category || "",
      price: req.body.price || 0,
      numberInStock: req.body.numberInStock || 0,
      sku: uuidv4(),
      specifications: req.body.specifications || "",
      locations: req.body.locations || "",
    };

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      const [allManufacturer, allCategory, allLocations] = await Promise.all([
        Manufacturer.find().exec(),
        Category.find().exec(),
        Locations.find().exec(),
      ]);

      res.render("forms/hardware_form", {
        title: "Hardware Form Submission Failed",
        text: "Please review and correct the following issues before submitting the form:",
        manufacturers: allManufacturer,
        categories: allCategory,
        locations: allLocations,
        oldHardware: newHardware,
        errors: errors.array(),
      });
      return;
    } else {
      console.log("Validation succesfull");
      console.log("Save new document");

      await newHardware.save();

      return res.redirect("/catalog");
    }
  }),
];
