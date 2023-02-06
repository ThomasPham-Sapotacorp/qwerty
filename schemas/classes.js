const mongoose = require('mongoose');
//Create schema
const ClassSchema = new mongoose.Schema({
  name: String,
  status: String,
  ordering: Number,
  slug: String,
  created: {
    user_id: mongoose.Schema.ObjectId,
    user_name: String,
    time: Date,
  },
  modified: {
    user_id: mongoose.Schema.ObjectId,
    user_name: String,
    time: Date,
  }
});

module.exports = mongoose.model('classes', ClassSchema);