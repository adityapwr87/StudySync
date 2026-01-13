import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
// 1. UPDATE IMPORT
import { updateResourceInFolder } from "../../api/api";

// 2. ADD folderId PROP
const EditResourceModal = ({
  isOpen,
  onClose,
  folderId,
  resourceData,
  onResourceUpdated,
}) => {
  const [title, setTitle] = useState(resourceData?.title || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 3. UPDATE API CALL
      // Now requires folderId, resourceId, and the data payload
      console.log("Updating Resource:", { folderId, resourceId: resourceData._id, title });
      const { data } = await updateResourceInFolder(
        folderId,
        resourceData._id,
        { title }
      );

      onResourceUpdated(data);
      toast.success("Renamed successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (JSX remains exactly the same) ...
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Rename Resource</h3>
          <button onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </div>
        <form onSubmit={handleUpdate} className="modal-body">
          <div className="form-group">
            <label>New Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditResourceModal;
