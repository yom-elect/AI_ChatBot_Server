const mongoose = require("mongoose");
const config = require("./../config/keys");

const mongooseConnect = () => {
  mongoose
    .connect(config.mongoURI, { useNewUrlParser: true })
    .then(result => {
      console.log("connected");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.mongooseConnect = mongooseConnect;
