const Blog = require("mongoose").model("Blog");
const Formidable = require("formidable");
const smartTrim = require("../utils/smartTrim");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const dbErrorHandler = require("../utils/dbErrorHandler");
const _ = require("lodash");

exports.create = (req, res, next) => {
  const errors = {};

  let form = new Formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      errors.photo = "Photo could not upload";
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      errors.title = "Title is required";
    }

    if (!body || body.length < 200) {
      errors.body = "Content is too short (200 minimum characters)";
    }

    if (!categories || categories.length === 0) {
      errors.categories = "At least one category is required";
    }

    // Return errors if present
    if (!_.isEmpty(errors)) {
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
    const arrayOfTags = tags && tags.split(",");

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

      res.json(savedBlog);

      // Blog.findByIdAndUpdate(
      //   savedBlog._id,
      //   {
      //     $push: { categories: arrayOfCategories },
      //   },
      //   { new: true }
      // ).exec((err, savedBlog) => {
      //   if (err) {
      //     return res.status(400).json({
      //       error: dbErrorHandler(err),
      //     });
      //   } else {
      //     Blog.findByIdAndUpdate(
      //       savedBlog._id,
      //       {
      //         $push: { tags: arrayOfTags },
      //       },
      //       { new: true }
      //     ).exec((err, savedBlog) => {
      //       if (err) {
      //         return res.status(400).json({
      //           error: dbErrorHandler(err),
      //         });
      //       } else {
      //         res.json(savedBlog);
      //       }
      //     });
      //   }
      // });
    });
  });
};
