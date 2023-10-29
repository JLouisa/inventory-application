const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* GET all category page. */
router.get("/", categoryController.category);

// GET category create form page
router.get("/create", categoryController.categoryCreateGet);

/* POST category page. */
router.post("/create", categoryController.categoryCreatePost);

/* GET category update page. */
router.get("/update/:id", categoryController.categoryUpdateGet);

/* POST category update page. */
router.post("/update/:id", categoryController.categoryUpdatePost);

/* GET category delete page. */
router.get("/delete/:id", categoryController.categoryDeleteGet);

/* POST category delete page. */
router.post("/delete/:id", categoryController.categoryDeletePost);

/* GET category details page. */
router.get("/:id", categoryController.categoryDetails);

module.exports = router;
