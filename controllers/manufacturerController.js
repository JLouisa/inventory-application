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

      return res.redirect("../manufacturer");
    }
  }),
];

//! GET Manufacturer Update page
exports.manufacturerUpdateGet = asyncHandler(async function (req, res, next) {
  const [theManufacturer, allCategories] = await Promise.all([
    Manufacturer.findById(req.params.id),
    Category.find().exec(),
  ]);

  if (theManufacturer === null) {
    // No results.
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  function putInArr(obj) {
    const arr = [];
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          arr.push(`${obj[key]}`);
        }
      }
      return arr.join("");
    }
    return obj;
  }

  const newWarranties = putInArr(theManufacturer.warranties);
  console.log("newWarranties");
  console.log(newWarranties);

  const new2Manufacturer = {
    name: theManufacturer.name || "",
    joinedDate: theManufacturer.joinedDate || "",
    address: theManufacturer.address || "",
    warranties: newWarranties,
  };

  res.render("forms/manufacturer_form", {
    title: "This is the Manufacturer Update page",
    oldManufacturer: new2Manufacturer,
    categories: allCategories,
  });
});

//! POST Manufacturer Update page
exports.manufacturerUpdatePost = [
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
    console.log(req.body);
    const [allCategories, theCategory] = await Promise.all([
      Category.find().exec(),
      Category.findById(req.body.category).exec(),
    ]);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newManufacturer = new Manufacturer({
      _id: req.params.id ? req.params.id : undefined,
      name: req.body.name || "",
      joinedDate: req.body.joinedDate || "",
      address: req.body.address || "",
      warranties:
        {
          [theCategory.name]: req.body.warranties,
        } || "",
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("forms/manufacturer_form", {
        title: "Manufacturer Update Failed",
        text: "Please review and correct the following issues before submitting the form:",
        oldManufacturer: newManufacturer,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedManufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, newManufacturer, {});

      // Redirect to book detail page.
      return res.redirect(updatedManufacturer.url);
    }
  }),
];

//! GET Manufacturer Delete page
exports.manufacturerDeleteGet = asyncHandler(async function (req, res, next) {
  const theManufacturer = await Manufacturer.findById(req.params.id).exec();

  function capitalizeFirstLetter(word) {
    if (typeof word !== "number") return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const newManufacturer = {
    Name: capitalizeFirstLetter(theManufacturer.name),
    joinedDate: theManufacturer.joinedDate,
    Address: theManufacturer.address,
  };

  res.render("delete/delete_page", {
    title: "This is the Category Delete GET page",
    text: `Are you sure you want to delete '${theManufacturer.name}'`,
    item: theManufacturer,
    item2: newManufacturer,
    url: theManufacturer.url,
  });
});

//! POST Manufacturer Delete page
exports.manufacturerDeletePost = asyncHandler(async function (req, res, next) {
  // Get details of author and all their books (in parallel)
  const theManufacturer = await Manufacturer.findById(req.params.id).exec();

  // Redirect to Book List if there is no book to delete
  if (theManufacturer === null) res.redirect("/manufacturer");

  // Delete object and redirect to the list of books.
  await Manufacturer.findByIdAndRemove(req.params.id);
  res.redirect("/manufacturer");
});
