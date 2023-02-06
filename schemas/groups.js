const mongoose = require('mongoose');
//Create schema
const GroupSchema = new mongoose.Schema({
  name: String,
  status: String,
  ordering: Number,
  slug: String,
  class: { type:mongoose.Schema.ObjectId, ref: "classes" },
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

module.exports = mongoose.model('groups', GroupSchema);