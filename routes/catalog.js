const express = require("express");
const router = express.Router();
const hardwareController = require("../controllers/hardwareController");

// GET catalog page
router.get("/", hardwareController.catalog);

// GET product page
router.get("/hardware/:id", hardwareController.product);

// GET product create form page
router.get("/create", hardwareController.hardwareCreateGet);

/* GET category update page. */
router.get("/update/:id", hardwareController.hardwareUpdateGet);

/* POST category update page. */
router.post("/update/:id", hardwareController.hardwareUpdatePost);

/* GET category delete page. */
router.get("/delete/:id", hardwareController.hardwareDeleteGet);

/* POST category delete page. */
router.post("/delete/:id", hardwareController.hardwareDeletePost);

// POST product create form page
router.post("/create", hardwareController.hardwareCreatePost);

module.exports = router;
