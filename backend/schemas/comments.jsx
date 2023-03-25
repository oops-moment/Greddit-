const mongoose = require("mongoose");
// Added validation to ensure that comment is not empty
const Comments = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId}, 
    comment: {
      type: String,
      required: true,
      minlength: 1,
    },
    commentedby:String,
  });

mongoose.model("Comments", Comments);
  