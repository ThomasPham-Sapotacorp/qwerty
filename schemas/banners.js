const mongoose = require('mongoose');
    //Create schema
const Schema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  ordering: Number,
  status: String,
  created: {
    user_id: mongoose.Schema.ObjectId,
    user_name: String,
    time: Date,
  },
});

module.exports = mongoose.model('banners', Schema);