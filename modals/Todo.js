const mongoose = require("mongoose");

const todo = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      smallCase: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    id: {
      type: mongoose.Types.ObjectId,
    },
    time: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("todo", todo);
