const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Hardware = require("../models/hardware");
const Category = require("../models/category");
const dotenv = require("dotenv").config();

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
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newCategory = new Category({
      name: req.body.name || "",
      description: req.body.description || "",
    });

    if (!errors.isEmpty()) {
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
      await newCategory.save();

      return res.redirect("../category");
    }
  }),
];

//! GET Category Update page
exports.categoryUpdateGet = asyncHandler(async function (req, res, next) {
  const theCategory = await Category.findById(req.params.id);

  if (theCategory === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("forms/category_form", {
    title: "This is the Category Update page",
    url: "/category",
    oldCategory: theCategory,
  });
});

//! POST Category Update page
exports.categoryUpdatePost = [
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
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const newCategory = new Category({
      _id: req.params.id ? req.params.id : undefined,
      name: req.body.name || "",
      description: req.body.description || "",
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("forms/category_form", {
        title: "Location Update Failed",
        text: "Please review and correct the following issues before submitting the form:",
        oldCategory: newCategory,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, newCategory, {});

      // Redirect to book detail page.
      return res.redirect(updatedCategory.url);
    }
  }),
];

//! GET Category Delete page
exports.categoryDeleteGet = asyncHandler(async function (req, res, next) {
  const theCategory = await Category.findById(req.params.id);

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const newCate = {
    Name: capitalizeFirstLetter(theCategory.name),
    Description: capitalizeFirstLetter(theCategory.description),
  };

  res.render("delete/delete_page", {
    title: "This is the Category Delete GET page",
    text: `Are you sure you want to delete '${theCategory.name}'`,
    item: theCategory,
    item2: newCate,
    url: `/category/${theCategory._id}`,
    alertMessage: "TEsting",
  });
});

//! POST Category Delete page
exports.categoryDeletePost = asyncHandler(async function (req, res, next) {
  console.log(req.body);
  const theCategory = await Category.findById(req.params.id).exec();

  // Redirect to Book List if there is no book to delete
  if (theCategory === null) res.redirect("/category");

  // Check secret key
  if (req.body.secretKey !== process.env.SECRECT_KEY) {
    console.log("Secretkey matched");
    res.render("delete/no_delete_auth", {
      title: "This is the Category Delete GET page",
      text: `You can't delete '${theCategory.name}'`,
      url: "/category/delete/" + theCategory._id,
      msg: "Sorry the key you provided is incorrect. You can't delete/ update this page. Please refresh your page and try again.",
    });
    return;
  }

  // Delete object and redirect to the list of books.
  await Category.findByIdAndRemove(req.params.id);
  res.redirect("/category");
});
