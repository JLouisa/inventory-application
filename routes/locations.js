const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

/* GET locations page. */
router.get("/", locationsController.locations);

/* GET locations page. */
router.get("/create", locationsController.locationsCreateGet);

/* GET locations page. */
router.post("/create", locationsController.locationsCreatePost);

/* GET category update page. */
router.get("/update/:id", locationsController.locationsUpdateGet);

/* POST category update page. */
router.post("/update/:id", locationsController.locationsUpdatePost);

/* GET category delete page. */
router.get("/delete/:id", locationsController.locationsDeleteGet);

/* POST category delete page. */
router.post("/delete/:id", locationsController.locationsDeletePost);

/* GET locations detail page. */
router.get("/:id", locationsController.locationsDetail);

module.exports = router;
