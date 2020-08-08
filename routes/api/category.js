const router = require("express").Router();

// Validators
const { runValidation } = require("../../validators");
const { validateCreateCategory } = require("../../validators/category");

const { adminMiddleware } = require("../../controllers/auth");
const auth = require("../auth");
const { create } = require("../../controllers/category");

router.post(
  "/",
  auth.required,
  adminMiddleware,
  validateCreateCategory,
  runValidation,
  create
);

module.exports = router;
