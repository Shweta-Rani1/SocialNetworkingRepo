const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // The post being shared
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The user who shared the post
  created_at: { type: Date, default: Date.now }, // Timestamp of when the post was shared
});

module.exports = mongoose.model("Share", shareSchema);