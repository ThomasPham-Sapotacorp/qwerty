const mongoose = require('mongoose');
//Create schema
const Schema = new mongoose.Schema({
  name: String,
  amount: Number,
  price: Number,
  total: Number,
  created: Date,
});

module.exports = mongoose.model('items', Schema);