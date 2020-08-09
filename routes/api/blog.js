const router = require("express").Router();
const { create, read, remove } = require("../../controllers/blog");
const auth = require("../auth");
const { adminMiddleware } = require("../../controllers/auth");

// /api/blog

router.get("/test", (req, res) => {
  res.json({
    message: "Blog route",
  });
});

// Create blog
router.post("/", auth.required, create);

// Read blog
router.get("/:slug", read);

// Remove blog
router.delete("/:slug", auth.required, adminMiddleware, remove);

module.exports = router;
