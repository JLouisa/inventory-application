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
exports.locationsDetail = asyncHandler(async function (req, res, next) {
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

//! GET Locations Update page
exports.locationsUpdateGet = asyncHandler(async function (req, res, next) {
  const theLocation = await Location.findById(req.params.id);

  if (theLocation === null) {
    // No results.
    const err = new Error("Location not found");
    err.status = 404;
    return next(err);
  }

  res.render("forms/location_form", {
    title: "This is the Location Update page",
    oldLocation: theLocation,
  });
});

//! POST Locations Update page
exports.locationsUpdatePost = [
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
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newLocation = new Location({
      _id: req.params.id ? req.params.id : undefined,
      name: req.body.name || "",
      address: req.body.address || "",
      capacity: req.body.capacity || "",
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("forms/location_form", {
        title: "Location Update Failed",
        text: "Please review and correct the following issues before submitting the form:",
        oldCategory: newLocation,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedLocation = await Location.findByIdAndUpdate(req.params.id, newLocation, {});

      // Redirect to book detail page.
      return res.redirect(updatedLocation.url);
    }
  }),
];

//! GET Locations Delete page
exports.locationsDeleteGet = asyncHandler(async function (req, res, next) {
  const theLocation = await Location.findById(req.params.id).exec();

  function capitalizeFirstLetter(word) {
    if (typeof word !== "number") return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const newLocation = {
    Name: capitalizeFirstLetter(theLocation.name),
    Address: theLocation.address,
    Capacity: theLocation.capacity,
  };

  res.render("delete/delete_page", {
    title: "This is the Category Delete GET page",
    text: `Are you sure you want to delete '${theLocation.name}'`,
    item: theLocation,
    item2: newLocation,
    url: theLocation.url,
  });
});

//! POST Locations Delete page
exports.locationsDeletePost = asyncHandler(async function (req, res, next) {
  // Get details of author and all their books (in parallel)
  const theLocation = await Location.findById(req.params.id).exec();

  // Redirect to Book List if there is no book to delete
  if (theLocation === null) res.redirect("/locations");

  // Delete object and redirect to the list of books.
  await Location.findByIdAndRemove(req.params.id);
  res.redirect("/locations");
});
