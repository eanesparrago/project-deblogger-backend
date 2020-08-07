const mongoose = require("mongoose");
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

exports.logIn = (req, res, next) => {
  
}