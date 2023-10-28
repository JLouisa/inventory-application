const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Location = require("../models/locations");

exports.locations = asyncHandler(async function (req, res, next) {
  const allLocations = await Location.find().exec();
  res.render("locations", {
    title: "Locations",
    text: "Welcome to our locations",
    allLocations: allLocations,
  });
});

exports.locationDetail = asyncHandler(async function (req, res, next) {
  const location = await Location.findById(req.params.id).exec();
  res.render("locations_details", {
    location: location,
  });
});
