const express = require("express");
const router = express.Router();
const {
  createFolder,
  getFolders,
  getFolderById,
  renameFolder,
  deleteFolder,
  createBookmarkInFolder,
  getBookmarksInFolder,
  removeBookmarkFromFolder,
  updateBookmarkInFolder,
  createShare,
  revokeShare,
  getSharedFolderByToken,
} = require("../controllers/folderController");
const protect = require("../middleware/authmiddleware");
const upload = require("../utils/upload");
// Folder CRUD
router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.get("/:folderId", protect, getFolderById);
router.put("/:folderId", protect, renameFolder);
router.delete("/:folderId", protect, deleteFolder);

// Folder-specific bookmark routes
router.get("/:folderId/bookmarks", protect, getBookmarksInFolder);
router.post(
  "/:folderId/bookmark",
  protect,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createBookmarkInFolder,
);
router.put(
  "/:folderId/bookmark/:bookmarkId",
  protect,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]), // Handle potential file update
  updateBookmarkInFolder,
);
router.delete(
  "/:folderId/bookmark/:bookmarkId",
  protect,
  removeBookmarkFromFolder,
);

// Share endpoints (minimal)
router.post("/:folderId/share", protect, createShare);
router.post("/:folderId/unshare", protect, revokeShare);

// Public access by token
router.get("/public/:token", getSharedFolderByToken);

module.exports = router;
