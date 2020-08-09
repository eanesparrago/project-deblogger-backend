const router = require("express").Router();
const { list } = require("../../controllers/blogs");
const auth = require("../auth");
const { adminMiddleware } = require("../../controllers/auth");

// /api/blogs

// Get blogs
router.get("/", list);

module.exports = router;
