const { check } = require("express-validator");

exports.validateUserSignup = [
  check("user.username").not().isEmpty().withMessage("Username is required"),
  check("user.email").isEmail().withMessage("Must be a valid email address"),
  check("user.password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateUserSignin = [
  check("user.email").isEmail().withMessage("Must be a valid email address"),
  check("user.password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateForgotPassword = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];

exports.validateResetPassword = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
