const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Hardware = require("../models/hardware");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

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
    category: hardware.category.name,
    specifications: hardware.specifications,
    warranty: hardware.warrantyInformation,
    manufacturer: hardware.manufacturer.name,
    price: Number(hardware.price).toFixed(2),
    stock: hardware.numberInStock,
  });
});
