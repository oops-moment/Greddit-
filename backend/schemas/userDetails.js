
const mongoose = require("mongoose");
const validator = require("validator");

// adding backend validators for register
const userDetailsschema = new mongoose.Schema({
  user_name: { 
    type: String, 
    unique: true,
    required: true,
  },
    pass_word: {
    type: String,
    required: true,
     minlength: 8
  },
    FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
    age: {
    type: Number,
    required: true,
    min: 10
  },
    contact: {
    type: Number,
    required: true,
    minlength: 10
  },
    email: {
    type: String,
    unique: true,
    required: true,
    // backend validation for the email
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    }
}});

mongoose.model("Registered Users", userDetailsschema);
