const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("User");

exports.create = (req, res, next) => {
  const user = new User();

  console.log(req.body);

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

// /user/login
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
