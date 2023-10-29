const express = require("express");
const router = express.Router();
const manufacturersController = require("../controllers/manufacturerController");

/* GET locations page. */
router.get("/", manufacturersController.manufacturers);

/* GET locations create form page. */
router.get("/create", manufacturersController.manufacturerCreateGet);

/* POST locations create form page. */
router.post("/create", manufacturersController.manufacturerCreatePost);

/* GET locations update detail page. */
router.get("/update/:id", manufacturersController.manufacturerUpdateGet);

/* POST locations update detail page. */
router.post("/update/:id", manufacturersController.manufacturerUpdatePost);

/* GET locations delete detail page. */
router.get("/delete/:id", manufacturersController.manufacturerDeleteGet);

/* POST locations delete page. */
router.post("/delete/:id", manufacturersController.manufacturerDeletePost);

/* GET locations detail page. */
router.get("/:id", manufacturersController.manufacturerDetails);

module.exports = router;
