const router = require("express").Router();
const { list, listAllBlogsCategories, listRelated } = require("../../controllers/blogs");
const auth = require("../auth");
const { adminMiddleware } = require("../../controllers/auth");

// /api/blogs

// List all blogs
router.get("/", list);

// List all blogs, categories, tags
router.post("/blogs-categories", listAllBlogsCategories);

// List related blogs
router.post("/related", listRelated)

module.exports = router;
