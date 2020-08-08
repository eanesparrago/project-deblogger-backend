const { check } = require("express-validator");

exports.validateCreateCategory = [
  check("name").not().isEmpty().withMessage("Category name is required"),
];
