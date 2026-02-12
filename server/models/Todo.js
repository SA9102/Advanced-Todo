const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    enum: ["1", "2", "3"],
    required: true,
  },
  tags: [
    {
      type: String,
      ref: "Tag",
    },
  ],
  isComplete: {
    type: Boolean,
    required: true,
  },
  start: {
    type: Date,
    default: null,
  },
  end: {
    type: Date,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
