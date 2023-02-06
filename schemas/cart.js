const mongoose = require('mongoose');
//Create schema
const Schema = new mongoose.Schema({
  item: [{ type:mongoose.Schema.ObjectId, ref: "books" }],
  totalQty: Number,
  totalPrice: Number,
});

module.exports = mongoose.model('cart', Schema);