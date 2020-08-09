const Blog = require("mongoose").model("Blog");
const Formidable = require("formidable");
const smartTrim = require("../utils/smartTrim");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const dbErrorHandler = require("../utils/dbErrorHandler");

exports.create = (req, res, next) => {
  const errors = [];

  let form = new Formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      errors.push({
        param: "photo",
        msg: "Photo could not upload",
      });
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      errors.push({
        param: "title",
        msg: "Title is required",
      });
    }

    if (!body || body.length < 200) {
      errors.push({
        param: "body",
        msg: "Content is too short (200 minimum characters)",
      });
    }

    if (!categories || categories.length === 0) {
      errors.push({
        param: "categories",
        msg: "At least one category is required",
      });
    }

    // Return errors if present
    if (errors.length !== 0) {
      return res.status(400).json({ errors });
    }

    let blog = new Blog();

    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(body, 320, " ", "...");
    blog.slug = slugify(title, { lower: true });
    blog.metaTitle = `${title} | ${process.env.APP_NAME}`;
    blog.metaDescription = stripHtml(body.substring(0, 160));
    blog.postedBy = req.payload.id;

    // Categories and tags
    const arrayOfCategories = categories && categories.split(",");
    // const arrayOfTags = tags && tags.split(",");

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image size should be less than 1mb",
        });
      }

      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog.save((err, savedBlog) => {
      if (err) {
        return res.status(400).json({
          error: dbErrorHandler(err),
        });
      }

      Blog.findByIdAndUpdate(
        savedBlog._id,
        {
          $push: { categories: arrayOfCategories },
        },
        { new: true }
      ).exec((err, savedBlog) => {
        if (err) {
          return res.status(400).json({
            error: dbErrorHandler(err),
          });
        } else {
          res.json(savedBlog);
        }
      });
    });
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug })
    .populate("postedBy", "_id name username profile")
    .populate("categories", "_id name slug")
    .select(
      "_id title slug body metaTitle metaDescription categories postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: dbErrorHandler(err),
        });
      }

      res.json(data);
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: dbErrorHandler(err),
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  });
};
