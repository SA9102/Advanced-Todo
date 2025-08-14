const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tagId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
