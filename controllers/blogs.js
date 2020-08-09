const Blog = require("mongoose").model("Blog");
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
