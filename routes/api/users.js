const router = require("express").Router();
const { create, logIn } = require("../../controllers/users");

router.get("/test", (req, res) => {
  res.json({
    message: "User route",
  });
});

// Create user
router.post("/users", create);

// Login user
router.post("/users/login", logIn);

module.exports = router;
