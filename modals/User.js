const mongoose = require("mongoose");
const todo = require("./Todo");

const user = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      smallCase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      smallCase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
    },
    todos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "todo",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", user);
