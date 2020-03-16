const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  product: String,
  counter: { type: Number, default: 1 }
});

module.exports = mongoose.model("product", productSchema);
