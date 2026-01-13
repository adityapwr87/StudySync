import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiFileText,
  FiLink,
  FiTrash2,
  FiEdit2,
  FiExternalLink,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AddResourceModal from "./AddResourceModal";
import EditResourceModal from "./EditResourceModal";
// 1. UPDATE IMPORTS
import { getResourcesInFolder, removeResourceFromFolder } from "../../api/api";
import "./Folder.css";

const ResourceList = ({ folderId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (state remains same) ...
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (folderId) fetchResources(); // Ensure folderId exists
  }, [folderId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data } = await getResourcesInFolder(folderId);
      setResources(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // ... (handlers remain same) ...
  const handleResourceAdded = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
  };

  const handleResourceUpdated = (updatedResource) => {
    setResources((prev) =>
      prev.map((r) => (r._id === updatedResource._id ? updatedResource : r))
    );
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Delete this resource permanently?")) return;
    try {
      // 2. UPDATE API CALL
      // Pass folderId and resourceId
      await removeResourceFromFolder(folderId, resourceId);

      setResources((prev) => prev.filter((r) => r._id !== resourceId));
      toast.success("Resource deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setIsEditOpen(true);
  };

  return (
    <div className="resource-list-container">
      {/* ... (Action Bar and Grid remain same) ... */}
      <div className="flex justify-end mb-4">
        <button className="btn-gradient" onClick={() => setIsAddOpen(true)}>
          <FiPlus /> Add Resource
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Loading resources...</p>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <h3>No resources yet</h3>
          <p>Upload PDFs, Images, or save helpful Links here.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {resources.map((res) => (
            <div key={res._id} className="resource-card">
              <div className="card-icon-area">
                {res.resourceType === "link" ? (
                  <FiLink className="res-icon link-icon" />
                ) : (
                  <FiFileText className="res-icon file-icon" />
                )}
              </div>

              <div className="card-content">
                <h4 className="res-title" title={res.title}>
                  {res.title}
                </h4>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-link"
                >
                  Open {res.resourceType === "link" ? "Link" : "File"}{" "}
                  <FiExternalLink />
                </a>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => openEditModal(res)}
                  className="icon-btn edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(res._id)}
                  className="icon-btn delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <AddResourceModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        folderId={folderId}
        onResourceAdded={handleResourceAdded}
      />

      {editingResource && (
        <EditResourceModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingResource(null);
          }}
          // 3. PASS FOLDER ID PROP HERE
          folderId={folderId}
          resourceData={editingResource}
          onResourceUpdated={handleResourceUpdated}
        />
      )}
    </div>
  );
};

export default ResourceList;
