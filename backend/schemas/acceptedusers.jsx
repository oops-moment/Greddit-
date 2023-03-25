const mongoose = require("mongoose");
const acceptedusersSchema = new mongoose.Schema({
  username: String,
  subgredditName: String,
  joinDate: { type: Date, default: Date.now }
});

mongoose.model("approvedrequests", acceptedusersSchema);
