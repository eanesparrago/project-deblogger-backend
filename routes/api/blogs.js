const router = require("express").Router();
const { list, listAllBlogsCategories } = require("../../controllers/blogs");
const auth = require("../auth");
const { adminMiddleware } = require("../../controllers/auth");

// /api/blogs

// List all blogs
router.get("/", list);

// List all blogs, categories, tags
router.post("/blogs-categories", listAllBlogsCategories);

module.exports = router;
