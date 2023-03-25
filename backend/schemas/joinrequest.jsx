const mongoose = require("mongoose");

const joinrequest = new mongoose.Schema({
    subGredditName: String,
    username:String,
  });

mongoose.model("joinrequests", joinrequest);
