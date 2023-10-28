const asyncHandler = require("express-async-handler");
const { validationResult, check } = require("express-validator");
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
exports.createGet = asyncHandler(async function (req, res, next) {
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
exports.createPost = asyncHandler(async function (req, res, next) {
  console.log("Route handler executed");
  // Sanitize and validate input
  const validationRules = [
    check("name").notEmpty().withMessage("Name must not be empty").trim().escape(),
    check("manufacturer").withMessage("Manufacturer must not be empty").notEmpty().trim().escape(),
    check("description").withMessage("Description must not be empty").notEmpty().trim().escape(),
    check("category").withMessage("Category must not be empty").notEmpty().trim().escape(),
    check("price").withMessage("Price must not be empty").notEmpty().trim().escape(),
    check("specifications").withMessage("Specifications must not be empty").notEmpty().trim().escape(),
    check("locations").withMessage("Locations must not be empty").notEmpty().trim().escape(),
    check("numberInStock")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Number in stock must be a positive integer")
      .toInt(),
  ];

  // Apply validation rules
  await Promise.all(validationRules.map((rule) => rule(req, res, next)));

  // Check for validation errors
  const errors = validationResult(req);

  // Create new entity
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

  console.log("Errors:", errors.array());
  if (!errors.isEmpty()) {
    // Get all the manufacturer, category and locations
    const [allManufacturer, allCategory, allLocations] = await Promise.all([
      Manufacturer.find().exec(),
      Category.find().exec(),
      Locations.find().exec(),
    ]);

    // There are validation errors
    return res.render("forms/hardware_form", {
      title: "Hardware Form Failed",
      text: "Welcome to our hardware forms Failed",
      manufacturer: allManufacturer,
      category: allCategory,
      locations: allLocations,
      oldHardware: newHardware,
      errors: errors.array(),
    });
  } else {
    // No validation errors, continue with processing the data
    console.log("Validation succesfull");
    console.log("Save new document");

    await newHardware.save();

    return res.redirect("/catalog");
  }
});
