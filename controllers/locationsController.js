const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Location = require("../models/locations");

//! GET Request for all location
exports.locations = asyncHandler(async function (req, res, next) {
  const allLocations = await Location.find().exec();
  res.render("locations", {
    title: "Locations",
    text: "Welcome to our locations",
    allLocations: allLocations,
  });
});

//! GET Request for location details
exports.locationDetail = asyncHandler(async function (req, res, next) {
  const location = await Location.findById(req.params.id).exec();
  res.render("locations_details", {
    location: location,
  });
});

//! GET Request for location form creation
exports.locationsCreateGet = asyncHandler(async function (req, res, next) {
  // Create a genre object with escaped and trimmed data.
  const newLocation = {
    name: req.body.name || "",
    address: req.body.address || "",
    capacity: req.body.capacity || 0,
  };

  res.render("forms/location_form", {
    title: "Create Locations",
    text: "Add your Location details",
    oldHardware: newLocation,
  });
});

//! POST Request for location form submittion
exports.locationsCreatePost = [
  // Validate and sanitize the name field.
  body("name")
    .notEmpty()
    .withMessage("Name must not be empty")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters")
    .escape(),
  body("address")
    .notEmpty()
    .withMessage("address must not be empty")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters")
    .escape(),
  body("capacity")
    .notEmpty()
    .withMessage("capacity must not be empty")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("capacity must be between 1 and 20 characters")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    console.log(req.body);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const newLocation = new Location({
      name: req.body.name || "",
      address: req.body.address || "",
      capacity: req.body.capacity || 0,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("forms/location_form", {
        title: "Location Form Submission Failed",
        text: "Please review and correct the following issues before submitting the form:",
        oldLocation: newLocation,
        errors: errors.array(),
      });
      return;
    } else {
      console.log("Validation succesfull");
      console.log("Save new document");

      await newLocation.save();

      return res.redirect("/locations");
    }
  }),
];
