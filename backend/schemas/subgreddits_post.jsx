const mongoose = require("mongoose");
const subgreditposts = new mongoose.Schema({
  post_text: {
    type: String,
    required: true,
    min:1,
  },
  postedon: Date,
  postedby: String,
  subgrediitname: String,
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  upvotedby: [
    {
      type: String,
    },
  ],
  downvotedby: [
    {
      type: String,
    },
  ],
  blockedname:String
});

mongoose.model("subgreditposts", subgreditposts);
