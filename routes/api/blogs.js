const router = require("express").Router();
const {
  list,
  listAllBlogsCategories,
  listRelated,
  listSearch,
  listByUser
} = require("../../controllers/blogs");
const auth = require("../auth");
const { adminMiddleware } = require("../../controllers/auth");

// /api/blogs

// List all blogs
router.get("/", list);

// List all blogs, categories, tags
router.post("/blogs-categories", listAllBlogsCategories);

// List related blogs
router.post("/related", listRelated);

// Search blogs
router.post("/search", listSearch);

// List by user
router.get("/:username", listByUser)



module.exports = router;
