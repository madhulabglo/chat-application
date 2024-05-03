const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userModel = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamp: true,
  }
);
const user = model("User", userModel);

module.exports = user;
