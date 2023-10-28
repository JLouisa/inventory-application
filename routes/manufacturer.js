const express = require("express");
const router = express.Router();
const manufacturersController = require("../controllers/manufacturerController");

/* GET locations page. */
router.get("/", manufacturersController.manufacturers);

/* GET locations detail page. */
router.get("/:id", manufacturersController.manufacturerDetails);

module.exports = router;
