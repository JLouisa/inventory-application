const express = require("express");
const router = express.Router();
const hardwareController = require("../controllers/hardwareController");

// GET catalog page
router.get("/", hardwareController.catalog);

// GET product page
router.get("/hardware/:id", hardwareController.product);

// GET product create form page
router.get("/create", hardwareController.hardwareCreateGet);

// POST product create form page
router.post("/create", hardwareController.hardwareCreatePost);

module.exports = router;
