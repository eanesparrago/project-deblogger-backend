const router = require("express").Router();
const { create, read } = require("../../controllers/blog");
const auth = require("../auth");

// /api/blog

router.get("/test", (req, res) => {
  res.json({
    message: "Blog route",
  });
});

// Create blog
router.post("/", auth.required, create);

// Read blog
router.get("/:slug", read)

module.exports = router;
