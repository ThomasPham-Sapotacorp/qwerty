const mongoose = require('mongoose');
//Create schema
const Schema = new mongoose.Schema({
  cart: 
  [ { 
    id: mongoose.Schema.ObjectId , 
    qty: Number,
    name: String,
    price: Number,
    totalprice: Number,
    thumbnail: String
  } ],
  total: Number,
  note: String,
  created: Date,
  name: String,
  phone: String,
  address: String,
  status: String,
  user: { type:mongoose.Schema.ObjectId, ref: "users" },
});

module.exports = mongoose.model('bills', Schema);