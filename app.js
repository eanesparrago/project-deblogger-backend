const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Middlewares
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "deblogger",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

// Cors
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: process.env.CLIENT_URL }));
}

// DB
if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose
    .connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected");
    });
  mongoose.set("debug", true);
}

// Models
require("./models/User");
require("./models/Blog");

// Passport
require("./config/passport");

// Routes
app.use(require("./routes"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// Error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// Port
const port = process.env.PORT || 8000;

const server = app.listen(port, function () {
  console.log("Listening on port " + server.address().port);
});
