const Folder = require("../models/Folder");
const Bookmark = require("../models/Bookmark");
const uploadToS3 = require("../utils/s3Upload");
const crypto = require("crypto");

exports.createFolder = async (req, res) => {
  try {
    const { name, description, parentFolderId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await Folder.create({
      user: req.user.id,
      name,
      description,
      parentFolder: parentFolderId || null,
    });

    if (parentFolderId) {
      const parentFolder = await Folder.findOne({ _id: parentFolderId, user: req.user.id });
      if (parentFolder) {
        parentFolder.subfolders.push(folder._id);
        await parentFolder.save();
      }
    }

    return res.status(201).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id, parentFolder: null }).sort({
      createdAt: -1,
    });

    return res.status(200).json(folders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      user: req.user.id,
    })
      .populate({
        path: "bookmarks",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "subfolders",
        options: { sort: { createdAt: -1 } },
      });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.renameFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.folderId, user: req.user.id },
      { name },
      { new: true },
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const deleteFolderRecursively = async (folderId, userId) => {
  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) return;

  if (folder.subfolders && folder.subfolders.length > 0) {
    for (const subId of folder.subfolders) {
      await deleteFolderRecursively(subId, userId);
    }
  }

  await Bookmark.deleteMany({ folder: folderId, user: userId });
  await Folder.deleteOne({ _id: folderId, user: userId });
};

exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (folder.parentFolder) {
      await Folder.updateOne(
        { _id: folder.parentFolder },
        { $pull: { subfolders: folderId } }
      );
    }

    await deleteFolderRecursively(folderId, userId);

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting folder",
      error: error.message,
    });
  }
};

exports.createBookmarkInFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { title, link, tags, solution } = req.body;

    if (!title || !link) {
      return res.status(400).json({ message: "Title and link are required" });
    }

    const folder = await Folder.findOne({
      _id: folderId,
      user: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    let parsedTags = [];
    if (tags) {
      if (typeof tags === "string") {
        // Attempt to parse JSON string or split by comma
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(",").map((tag) => tag.trim());
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    let audioUrl = "";
    let imageUrl = "";
    if (req.files) {
      // audio may be in req.files.audio (array)
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = await uploadToS3(req.files.audio[0]);
      }
      // image may be in req.files.image (array)
      if (req.files.image && req.files.image[0]) {
        imageUrl = await uploadToS3(req.files.image[0]);
      }
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      folder: folderId,
      title,
      link,
      tags: parsedTags,
      solution: solution || "",
      audioUrl: audioUrl,
      imageUrl: imageUrl,
    });

    // Add bookmark to folder
    folder.bookmarks.push(bookmark._id);
    await folder.save();

    return res.status(201).json(bookmark);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.getBookmarksInFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      user: req.user.id,
    }).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder.bookmarks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.updateBookmarkInFolder = async (req, res) => {
  try {
    const { folderId, bookmarkId } = req.params;
    const { title, link, tags, solution } = req.body;

    // 1. Find Bookmark and Verify Ownership
    const bookmark = await Bookmark.findOne({
      _id: bookmarkId,
      user: req.user.id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // 2. Handle Tags Parsing (String -> Array)
    let parsedTags = bookmark.tags; // Default to existing
    if (tags) {
      if (typeof tags === "string") {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((t) => t);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // 3. Handle Audio/Image Uploads (If new files are sent)
    let audioUrl = bookmark.audioUrl; // Default to existing URL
    let imageUrl = bookmark.imageUrl || ""; // Default to existing or empty
    if (req.files) {
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = await uploadToS3(req.files.audio[0]);
      }
      if (req.files.image && req.files.image[0]) {
        imageUrl = await uploadToS3(req.files.image[0]);
      }
    }

    // 4. Update Fields
    bookmark.title = title || bookmark.title;
    bookmark.link = link || bookmark.link;
    bookmark.solution = solution || bookmark.solution;
    bookmark.tags = parsedTags;
    bookmark.audioUrl = audioUrl;
    bookmark.imageUrl = imageUrl;

    await bookmark.save();

    return res.status(200).json(bookmark);
  } catch (error) {
    console.error("Update Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.removeBookmarkFromFolder = async (req, res) => {
  try {
    const { folderId, bookmarkId } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      user: userId,
      folder: folderId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // Remove bookmark reference from folder
    await Folder.findByIdAndUpdate(folderId, {
      $pull: { bookmarks: bookmarkId },
    });

    return res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Make folder public by generating a share token
exports.createShare = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (!folder.shareToken) {
      folder.shareToken = crypto.randomBytes(8).toString("hex");
    }
    folder.isPublic = true;
    await folder.save();

    const frontend = process.env.FRONTEND_URL || null;
    const shareUrl = frontend
      ? `${frontend.replace(/\/$/, "")}/shared/folder/${folder.shareToken}`
      : null;

    return res.status(200).json({ token: folder.shareToken, shareUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Revoke public access
exports.revokeShare = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    folder.isPublic = false;
    folder.shareToken = null;
    await folder.save();

    return res.status(200).json({ message: "Share revoked" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Public access by token (no auth)
exports.getSharedFolderByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const folder = await Folder.findOne({ shareToken: token, isPublic: true })
      .populate({ path: "bookmarks", options: { sort: { createdAt: -1 } } })
      .populate({ path: "resources" })
      .populate({ path: "user", select: "username" });
    if (!folder)
      return res.status(404).json({ message: "Shared folder not found" });

    return res.status(200).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
