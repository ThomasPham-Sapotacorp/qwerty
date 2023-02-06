const mongoose = require('mongoose');
    //Create schema
const Schema = new mongoose.Schema({
  name: String,
  slug: String,
  price: Number,
  discount: Number,
  author: String,
  supplier: String,
  publishing: String,
  publishingYear: Date,
  weight: Number,
  page: Number,
  form: String,
  description: String,
  ordering: Number,
  status: String,
  thumbnail: [String],
  created: {
    user_id: mongoose.Schema.ObjectId,
    user_name: String,
    time: Date,
  },
  modified: {
    user_id: mongoose.Schema.ObjectId,
    user_name: String,
    time: Date,
  },
  category: { type:mongoose.Schema.ObjectId, ref: "categories" },
  group: { type:mongoose.Schema.ObjectId, ref: "groups" },
  class: { type:mongoose.Schema.ObjectId, ref: "classes" },

});

module.exports = mongoose.model('books', Schema);