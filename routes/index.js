const express = require("express");
const app = express();

/* GET home page. */

app.use("/users", require("./users"));
app.use("/api", require("./dialogApi/api"));
app.use("/", require("./fulfillment/fuilfillmentApi"));

module.exports = app;
