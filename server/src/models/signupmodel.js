const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const signupSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const signUpAuthenticate = model("users", signupSchema);

module.exports = signUpAuthenticate;
