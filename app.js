//! Import dependencies
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

//! Import Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

//! Express init
const app = express();

//! MongoDB Setup
const cluster = process.env.MONGODB_CLUSTER;
const host = process.env.MONGODB_HOST;
const user = encodeURIComponent(process.env.MONGODB_USER);
const pass = encodeURIComponent(process.env.MONGODB_PASS);

const mongoDB = `mongodb+srv://${user}:${pass}@${cluster}${host}`;

async function main(db) {
  await mongoose.connect(db);
}
// MonogDB init connection
main(mongoDB).catch((err) => console.log(err));

//! view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//! Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//! Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
