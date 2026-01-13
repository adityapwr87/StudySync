const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // Distinguishes between an uploaded file and a direct link
  resourceType: {
    type: String,
    enum: ["file", "link"],
    required: true,
  },
  // Stores the AWS S3 URL (for files) or the external URL (for links)
  url: {
    type: String,
    required: true,
  },
  // Crucial for deleting the actual file from AWS S3 later.
  // This will be null if resourceType is "link".
  s3Key: {
    type: String,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resource", resourceSchema);
