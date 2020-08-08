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

        if (files.photo) {
          if (files.photo.size > 10000000) {
            // 1mb maximum
            return res.status(422).json({
              error: "Image size should be less than 1mb",
            });
          }

          user.photo.data = fs.readFileSync(files.photo.path);
          user.photo.contentType = files.photo.type;
        }

        return user.save().then(() => {
          return res.json({ user: user.toAuthJson() });
        });
      });
    })
    .catch(next);
};

// get /user/photo/:username
exports.getPhotoByUsername = (req, res, next) => {
  const username = req.params.username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      if (user.photo.data) {
        res.set("Content-Type", user.photo.contentType);
        return res.send(user.photo.data);
      }
    })
    .catch(next);
};

// get /user/:username
exports.getPublicProfile = (req, res, next) => {
  const username = req.params.username;
  let user;
  let blogs;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      // TODO: Blog data

      return res.json(user.getPublicProfile());
    })
    .catch(next);
};