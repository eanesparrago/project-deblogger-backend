const router = require("express").Router();

// Validators
const { runValidation } = require("../../validators");
const { validateCreateCategory } = require("../../validators/category");

const { adminMiddleware } = require("../../controllers/auth");
const auth = require("../auth");
const { create, list, read, remove } = require("../../controllers/category");

// Create category
router.post(
  "/",
  auth.required,
  adminMiddleware,
  validateCreateCategory,
  runValidation,
  create
);

// Get all categories
router.get("/", list);

// Get blogs in category
router.get("/:slug", read);

// Delete category
router.delete("/:slug", auth.required, adminMiddleware, remove);

module.exports = router;
