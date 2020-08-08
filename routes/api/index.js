const { reduce } = require("lodash");

const router = require("express").Router();

router.use("/", require("./user"));
router.use("/blog", require("./blog"));
router.use("/category", require("./category"));

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;

        return errors;
      }, {}),
    });
  }

  return next(err);
});

module.exports = router;
