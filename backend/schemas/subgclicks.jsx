const mongoose = require("mongoose");
const subgreditClicks = new mongoose.Schema({
  date: Date,
  subgrediitname: String,
  clicks: {
    type: Number,
    default: 0,
  },
});

mongoose.model("subgreditClicks", subgreditClicks);
