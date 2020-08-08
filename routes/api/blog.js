const router = require("express").Router();
const { create } = require("../../controllers/blog");
const auth = require("../auth");

// /api/blog

router.get("/test", (req, res) => {
  res.json({
    message: "Blog route",
  });
});

router.post("/", auth.required, create);

module.exports = router;
