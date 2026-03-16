const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    originalProblemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    solution: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Folder",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
