const router = require("express").Router();
const { create, logIn, read } = require("../../controllers/user");
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

module.exports = router;
