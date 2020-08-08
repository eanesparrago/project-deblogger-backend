const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      max: 32,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      trime: true,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    name: {
      type: String,
      trim: true,
      max: 32,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    hash: String,
    salt: String,
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");

  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJwt = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000), // Expires in a month
    },
    secret
  );
};

UserSchema.methods.toAuthJson = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJwt(),
    bio: this.bio,
    role: this.role,
  };
};

UserSchema.methods.getPublicProfile = function () {
  return {
    username: this.username,
    email: this.email,
    name: this.name,
    bio: this.bio,
    role: this.role,
  };
};

mongoose.model("User", UserSchema);
