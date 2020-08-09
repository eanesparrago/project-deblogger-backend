const router = require("express").Router();
const {
  create,
  read,
  remove,
  update,
  getPhoto,
} = require("../../controllers/blog");
const auth = require("../auth");
const {
  adminMiddleware,
  canUpdateDeleteBlog,
} = require("../../controllers/auth");

// /api/blog

router.get("/test", (req, res) => {
  res.json({
    message: "Blog route",
  });
});

// Create blog
router.post("/", auth.required, adminMiddleware, create);

// Read blog
router.get("/:slug", read);

// Remove blog
router.delete("/:slug", auth.required, adminMiddleware, remove);

// Update blog
router.put("/:slug", auth.required, adminMiddleware, update);

// Get blog photo
router.get("/photo/:slug", getPhoto);

//// Auth user blog crud

// Create blog
router.post("/user", auth.required, create);

// Delete blog
router.delete("/user/:slug", auth.required, canUpdateDeleteBlog, remove);

// Update blog
router.put("/user/:slug", auth.required, canUpdateDeleteBlog, update);

module.exports = router;
