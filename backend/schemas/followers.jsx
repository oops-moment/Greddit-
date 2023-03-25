
const mongoose = require("mongoose");

const followers = new mongoose.Schema({
  username: { type: String, required: true },
  followedby: { type: String, required: true },
});

// Define a unique compound index on username and followedby fields
followers.index({ username: 1, followedby: 1 }, { unique: true });

mongoose.model("followers", followers);
