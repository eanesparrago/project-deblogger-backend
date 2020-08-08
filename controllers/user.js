const passport = require("passport");
const User = require("mongoose").model("User");
const formidable = require("formidable");
const fs = require("fs");

// post /user
exports.create = (req, res, next) => {
  const user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(() => {
      return res.json({ user: user.toAuthJson() });
    })
    .catch(next);
};

// post /user/login
exports.logIn = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJwt();

      return res.json({ user: user.toAuthJson() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
};

// get /user/profile
exports.read = (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({ user: user.toAuthJson() });
  });
};

// put /user
exports.update = (req, res, next) => {
  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            error: "Photo could not be uploaded",
          });
        }

        if (typeof fields.username !== "undefined") {
          user.username = fields.username;
        }

        if (typeof fields.email !== "undefined") {
          user.email = fields.email;
        }

        if (typeof fields.bio !== "undefined") {
          user.bio = fields.bio;
        }

        if (typeof fields.password !== "undefined") {
          user.setPassword(fields.password);
        }

        if (files.image) {
          if (files.image.size > 10000000) {
            // 1mb maximum
            return res.status(422).json({
              error: "Image should be less than 1mb",
            });
          }

          user.image.data = fs.readFileSync(files.image.path);
          user.image.contentType = files.image.type;
        }

        return user.save().then(() => {
          return res.json({ user: user.toAuthJson() });
        });
      });
    })
    .catch(next);
};
