const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  fileUrl: {
    type: String,
    required: true, // Cloudinary URL
  },
  summary: {
    type: String,
    default: "", // empty for now, AI fills this later
  },
  extractedText: {
    type: String,
    default: "", // empty for now, AI fills this later
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
