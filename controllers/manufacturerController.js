const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Manufacturer = require("../models/manufacturer");
const Hardware = require("../models/hardware");

exports.manufacturers = asyncHandler(async function (req, res, next) {
  const allManufacturer = await Manufacturer.find().exec();
  res.render("manufacturer", {
    title: "Manufacturers",
    text: "Welcome to our manufacturers page",
    allManufacturer: allManufacturer,
  });
});

exports.manufacturerDetails = asyncHandler(async function (req, res, next) {
  const theManufacturer = await Manufacturer.findById(req.params.id).exec();

  const allProducts = await Hardware.find({ manufacturer: theManufacturer._id }).populate("manufacturer").exec();

  res.render("manufacturer_details", {
    theManufacturer: theManufacturer,
    allProducts: allProducts,
  });
});
