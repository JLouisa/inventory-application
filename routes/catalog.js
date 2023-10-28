const express = require("express");
const router = express.Router();
const hardwareController = require("../controllers/hardwareController");

/* GET catalog page. */
router.get("/", hardwareController.catalog);

/* GET product page. */
router.get("/hardware/:id", hardwareController.product);

module.exports = router;
