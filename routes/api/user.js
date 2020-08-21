const router = require("express").Router();
const {
  create,
  logIn,
  read,
  update,
  getPhotoByUsername,
  getPublicProfile,
  signOut
} = require("../../controllers/user");
const auth = require("../auth");
const {
  validateForgotPassword,
  validateResetPassword,
  validateUserSignin,
  validateUserSignup,
} = require("../../validators/user");
const { runValidation } = require("../../validators/index");

router.get("/test", (req, res) => {
  res.json({
    message: "User route",
  });
});

// Create user
router.post("/user", validateUserSignup, runValidation, create);

// Login user
router.post("/user/login", validateUserSignin, runValidation, logIn);

// Read own user
router.get("/user/profile", auth.required, read);

// Update user
router.put("/user", auth.required, update);

// Get photo by username
router.get("/user/photo/:username", getPhotoByUsername);

// Read public profile
router.get("/user/:username", getPublicProfile);

// Sign out
router.get("/sign-out", signOut);

module.exports = router;
