const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");
const Category = mongoose.model("Category");
const User = mongoose.model("User");
const Formidable = require("formidable");
const smartTrim = require("../utils/smartTrim");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const dbErrorHandler = require("../utils/dbErrorHandler");
const _ = require("lodash");
const fs = require("fs");

exports.list = (req, res) => {
  Blog.find({})
    .populate("postedBy", "_id name profile")
    .populate("categories", "_id name slug")
    .select("_id title slug excerpt categories postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: dbErrorHandler(err),
        });
      }

      res.json(data);
    });
};

exports.listAllBlogsCategories = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;

  Blog.find({})
    .populate("postedBy", "_id name username profile")
    .populate("categories", "_id name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt categories postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: dbErrorHandler(err),
        });
      }

      blogs = data;

      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: dbErrorHandler(err),
          });
        }

        categories = c;

        // Return all blogs, categories
        res.json({ blogs, categories, size: blogs.length });
      });
    });
};

// { limit, blog }
exports.listRelated = (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "Blogs not found",
        });
      }

      res.json(blogs);
    });
};

exports.listSearch = (req, res) => {
  const { search } = req.query;

  Blog.find(
    {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    },
    (err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: dbErrorHandler(err),
        });
      }

      res.json(blogs);
    }
  ).select("-photo -body");
};

exports.listByUser = (req, res) => {
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: dbErrorHandler(err),
      });
    }

    const userId = user._id;

    Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("postedBy", "_id name username")
      .select("_id title slug postedBy createdAt updatedAt")
      .exec((err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: dbErrorHandler(err),
          });
        }

        res.json(blogs);
      });
  });
};
