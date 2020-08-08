const router = require("express").Router();

// Validators
const { runValidation } = require("../../validators");
const { validateCreateCategory } = require("../../validators/category");

const { adminMiddleware } = require("../../controllers/auth");
const auth = require("../auth");
const { create, read } = require("../../controllers/category");

// Create category
router.post(
  "/",
  auth.required,
  adminMiddleware,
  validateCreateCategory,
  runValidation,
  create
);

router.get("/:slug", read);

module.exports = router;
