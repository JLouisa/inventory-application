const express = require("express");
const router = express.Router();
const hardwareController = require("../controllers/hardwareController");

// GET catalog page
router.get("/", hardwareController.catalog);

// GET product create form page
router.get("/hardware/create", hardwareController.hardwareCreateGet);

/* GET category update page. */
router.get("/hardware/update/:id", hardwareController.hardwareUpdateGet);

/* POST category update page. */
router.post("/hardware/update/:id", hardwareController.hardwareUpdatePost);

/* GET category delete page. */
router.get("/hardware/delete/:id", hardwareController.hardwareDeleteGet);

/* POST category delete page. */
router.post("/hardware/delete/:id", hardwareController.hardwareDeletePost);

// POST product create form page
router.post("/hardware/create", hardwareController.hardwareCreatePost);

// GET product page
router.get("/hardware/:id", hardwareController.product);

module.exports = router;
