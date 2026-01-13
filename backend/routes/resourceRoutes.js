const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const upload = require("../utils/upload"); // Your existing Multer middleware

const {
  createResourceInFolder,
  getResourcesInFolder,
  updateResourceInFolder,
  removeResourceFromFolder,
} = require("../controllers/resourceController");

// Matches structure: POST /folders/:folderId/bookmark
router.post(
  "/:folderId/resource",
  auth,
  upload.single("file"),
  createResourceInFolder
);

// Matches structure: GET /folders/:folderId/bookmarks
router.get("/:folderId/resources", auth, getResourcesInFolder);

// Matches structure: PUT /folders/:folderId/bookmark/:bookmarkId
router.put(
  "/:folderId/resource/:resourceId",
  auth,
  updateResourceInFolder
);

// Matches structure: DELETE /folders/:folderId/bookmark/:bookmarkId
router.delete(
  "/:folderId/resource/:resourceId",
  auth,
  removeResourceFromFolder
);

module.exports = router;
