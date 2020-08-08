const passport = require("passport");
const User = require("mongoose").model("User");

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
