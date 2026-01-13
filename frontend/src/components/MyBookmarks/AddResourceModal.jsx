import React, { useState } from "react";
import { FiX, FiUploadCloud, FiLink } from "react-icons/fi";
import { toast } from "react-toastify";
// 1. UPDATE IMPORT
import { addResourceToFolder } from "../../api/api";

const AddResourceModal = ({ isOpen, onClose, folderId, onResourceAdded }) => {
  // ... (state definitions remain the same) ...
  const [title, setTitle] = useState("");
  const [type, setType] = useState("link");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (validation logic remains the same) ...
    if (!title) return toast.error("Title is required");
    if (type === "link" && !linkUrl) return toast.error("Please enter a URL");
    if (type === "file" && !file) return toast.error("Please select a file");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("resourceType", type); // removed folderId from formData, it's in URL now

      if (type === "link") {
        formData.append("linkUrl", linkUrl);
      } else {
        formData.append("file", file);
      }

      // 2. UPDATE API CALL
      // Pass folderId first, then the data
      const { data } = await addResourceToFolder(folderId, formData);

      onResourceAdded(data);
      toast.success("Resource added successfully!");
      onClose();

      setTitle("");
      setLinkUrl("");
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (JSX remains exactly the same) ...
    <div className="modal-overlay">
      <div className="modal-container">
        {/* ... contents ... */}
        {/* (No changes needed in JSX structure) */}
        <div className="modal-header">
          <h3>Add New Resource</h3>
          <button onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {/* ... inputs ... */}
          <div className="type-toggle-group">
            <button
              type="button"
              className={`toggle-btn ${type === "link" ? "active" : ""}`}
              onClick={() => setType("link")}
            >
              <FiLink /> Link
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === "file" ? "active" : ""}`}
              onClick={() => setType("file")}
            >
              <FiUploadCloud /> File Upload
            </button>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. System Design Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {type === "link" ? (
            <div className="form-group">
              <label>Resource URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Select File (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf, .png, .jpg, .jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Resource"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
