const mongoose = require("mongoose");
const dbErrorHandler = require("../utils/dbErrorHandler");
const User = mongoose.model("User");
const Blog = mongoose.model("Blog");

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;

    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.payload.id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;

    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  
  Blog.findOne({ slug }).exec((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: dbErrorHandler(err),
      });
    }

    const isUserAuthorized =
      blog.postedBy._id.toString() === req.payload.id.toString();

    if (!isUserAuthorized) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }

    next();
  });
};
