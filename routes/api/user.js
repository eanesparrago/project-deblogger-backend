const router = require("express").Router();
const { create, logIn } = require("../../controllers/user");

router.get("/test", (req, res) => {
  res.json({
    message: "User route",
  });
});

// Create user
router.post("/user", create);

// Login user
router.post("/user/login", logIn);

module.exports = router;
