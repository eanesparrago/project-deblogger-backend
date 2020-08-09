const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");
const Category = mongoose.model("Category");
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
