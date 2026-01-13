const Resource = require("../models/Resource");
const Folder = require("../models/Folder");
const uploadToS3 = require("../utils/s3Upload");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");

exports.createResourceInFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { title, resourceType, linkUrl } = req.body;

    // 1. Validate Input
    if (!title || !resourceType) {
      return res
        .status(400)
        .json({ message: "Title and Resource Type are required" });
    }

    // 2. Check Folder Existence
    const folder = await Folder.findOne({
      _id: folderId,
      user: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // 3. Handle Content Logic (File vs Link)
    let finalUrl = "";
    let s3Key = null;

    if (resourceType === "file") {
      if (req.file) {
        finalUrl = await uploadToS3(req.file, "resources");
        const urlParts = finalUrl.split(".amazonaws.com/");
        if (urlParts.length > 1) s3Key = urlParts[1];
      } else {
        return res
          .status(400)
          .json({ message: "File is required for file type" });
      }
    } else if (resourceType === "link") {
      if (!linkUrl)
        return res.status(400).json({ message: "Link URL is required" });
      finalUrl = linkUrl;
    }

    // 4. Create Resource
    const resource = await Resource.create({
      userId: req.user.id, // <--- FIXED: Changed from 'user' to 'userId'
      folderId: folderId,
      title,
      resourceType,
      url: finalUrl,
      s3Key,
    });

    // 5. Add Resource to Folder Array
    if (!folder.resources) {
      folder.resources = [];
    }
    folder.resources.push(resource._id);
    await folder.save();

    return res.status(201).json(resource);
  } catch (error) {
    console.error("Create Resource Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.getResourcesInFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      user: req.user.id,
    }).populate({
      path: "resources",
      options: { sort: { createdAt: -1 } },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder.resources || []);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.updateResourceInFolder = async (req, res) => {

  try {

    const { folderId, resourceId } = req.params;
    const { title } = req.body; // Currently only allowing title updates

    // 1. Find Resource
    const resource = await Resource.findOne({
      _id: resourceId,
      userId: req.user.id,
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // 2. Update Fields
    resource.title = title || resource.title;

    await resource.save();

    return res.status(200).json(resource);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.removeResourceFromFolder = async (req, res) => {
  try {
    const { folderId, resourceId } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const resource = await Resource.findOneAndDelete({
      _id: resourceId,
      userId: userId,
      folderId: folderId, // Ensure it matches the folder
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // 1. Remove from Folder Array
    await Folder.findByIdAndUpdate(folderId, {
      $pull: { resources: resourceId },
    });

    // 2. Delete from S3 (If it was a file)
    if (resource.resourceType === "file" && resource.s3Key) {
      try {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: resource.s3Key,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (s3Err) {
        console.error("S3 Deletion Error (Non-fatal):", s3Err);
      }
    }

    return res.status(200).json({ message: "Resource removed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
