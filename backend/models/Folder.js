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
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    subfolders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
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
