const express = require("express");
const app = express();
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

app.use("/", require("./home"));
app.use("/users", require("./users"));
app.use("/api", require("./dialogApi/api"));

module.exports = app;
