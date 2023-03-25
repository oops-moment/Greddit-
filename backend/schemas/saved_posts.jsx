const mongoose = require("mongoose");
const postschema = require("./subgreddits_post.jsx")
const savedposts = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId ,ref:"subgreditposts"},
    savedby: String,
  });
savedposts.index({ postId: 1, savedby: 1 }, { unique: true });
mongoose.model("savedposts", savedposts);
