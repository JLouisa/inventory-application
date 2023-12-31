//! Import dependencies
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");

//! Import Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");
const categoryRouter = require("./routes/category");
const locationsRouter = require("./routes/locations");
const manufacturersRouter = require("./routes/manufacturer");

//! Express init
const app = express();

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

app.use(limiter);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

app.use(compression());

//! MongoDB Setup
const cluster = process.env.MONGODB_CLUSTER;
const host = process.env.MONGODB_HOST;
const user = encodeURIComponent(process.env.MONGODB_USER);
const pass = encodeURIComponent(process.env.MONGODB_PASS);

const mongoDB = process.env.MONGODB_URI || `mongodb+srv://${user}:${pass}@${cluster}${host}`;

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
app.use("/category", categoryRouter); // Add category routes to middleware chain.
app.use("/locations", locationsRouter); // Add locations routes to middleware chain.
app.use("/manufacturer", manufacturersRouter); // Add manufacturers routes to middleware chain.

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
