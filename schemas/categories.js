const mongoose = require('mongoose');
//Create schema
const CateSchema = new mongoose.Schema({
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
  },
  group: { type:mongoose.Schema.ObjectId, ref: "groups" }
});

module.exports = mongoose.model('categories', CateSchema);