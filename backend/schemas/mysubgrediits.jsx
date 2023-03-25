const mongoose = require("mongoose");

const subGredditSchema = new mongoose.Schema({

    subGredditName: {
      type: String,
      required: true,
      
    },
    subGredditDescription: String,
    subGredditTag: [String],
    username:String,
    postedon: Date,
    bannedWords: [String],
    members: [String], // array of usernames who joined the subreddit
    total_posts: {
      type: Number,
      default: 0,
    },
    left_member: [String],
  });

mongoose.model("mysubgrediitnew", subGredditSchema);
  