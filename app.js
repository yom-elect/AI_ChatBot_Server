const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { LocalStorage } = require("node-localstorage");
const routes = require("./routes");
const bodyParser = require("body-parser");
const mongooseConnect = require("./util/database").mongooseConnect;
const axios = require("axios");
const localStorage = new LocalStorage("./scratch");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// const axiosHeaders = async () => {
//   const token = await localStorage.getItem("authToken");
//   // console.log(token);
//   axios.defaults.baseURL = `http://softtax.softalliance.com/mobile/`;
//   axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//   axios.defaults.headers.post["Content-Type"] = "application/json";
// };

// axiosHeaders();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// connect database
//mongooseConnect();
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
