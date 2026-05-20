const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
    // Sharing
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Folder", folderSchema);
