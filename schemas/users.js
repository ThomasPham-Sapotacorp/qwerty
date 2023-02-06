const mongoose = require('mongoose');
//Create schema
const Schema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  phone: String,
  address: String,
  created: Date,
  admin: String,
  avatar: String,
  cart: [ { 
    id: mongoose.Schema.ObjectId , 
    qty: Number,
    name: String,
    price: Number,
    totalprice: Number,
    thumbnail: String
  } ],
});

module.exports = mongoose.model('users', Schema);