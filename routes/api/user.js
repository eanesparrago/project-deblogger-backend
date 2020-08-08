const router = require("express").Router();
const { create, logIn, read, update, getPhotoByUsername } = require("../../controllers/user");
const auth = require("../auth");

router.get("/test", (req, res) => {
  res.json({
    message: "User route",
  });
});

// Create user
router.post("/user", create);

// Login user
router.post("/user/login", logIn);

// Read own profile
router.get("/user/profile", auth.required, read);

// Update user
router.put("/user", auth.required, update)

// Get photo by username
router.get("/user/photo/:username", getPhotoByUsername)

module.exports = router;
