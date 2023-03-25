const mongoose = require("mongoose");

const reports = new mongoose.Schema({
    reportedby: String,
    userreported: String,
    concern: String,
    textreported: String,
    subgredditname: String,
    postid: mongoose.Types.ObjectId,
    isBlocked: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("reports", reports);
