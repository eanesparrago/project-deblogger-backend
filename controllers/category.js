const mongoose = require("mongoose");

const Category = mongoose.model("Category");
const Blog = mongoose.model("Blog");
const slugify = require("slugify");
const dbErrorHandler = require("../utils/dbErrorHandler");

exports.create = (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });

  let category = new Category({ name, slug });

  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: dbErrorHandler(err),
      });
    }

    res.json(data);
  });
};
