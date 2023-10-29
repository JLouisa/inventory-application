const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

/* GET locations page. */
router.get("/", locationsController.locations);

/* GET locations page. */
router.get("/create", locationsController.locationsCreateGet);

/* GET locations page. */
router.post("/create", locationsController.locationsCreatePost);

/* GET locations detail page. */
router.get("/:id", locationsController.locationDetail);

module.exports = router;
