import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFolder, FiFileText, FiPlus, FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import { toast } from "react-toastify";
import {
  getFolderById,
  createFolderShare,
  revokeFolderShare,
  createFolder,
  deleteFolder,
  renameFolder
} from "../../api/api";
import ProblemList from "./ProblemList"; // Import the component we just made
import ResourceList from "./ResourceList"; // You will create this next
import "./Folder.css";

const Folder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [loadingFolder, setLoadingFolder] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);

  // STATE: Controls which tab is visible
  const [activeTab, setActiveTab] = useState("folders");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingFolderId, setEditingFolderId] = useState(null);

  const fetchFolderInfo = async () => {
    try {
      setLoadingFolder(true);
      const { data } = await getFolderById(id);
      setFolder(data);
    } catch (err) {
      console.error("Failed to fetch folder info", err);
    } finally {
      setLoadingFolder(false);
    }
  };

  useEffect(() => {
    fetchFolderInfo();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createFolder({ ...form, parentFolderId: id });
      setIsCreateOpen(false);
      toast.success("Folder Created successfully!", { position: "top-right", autoClose: 4000 });
      fetchFolderInfo();
    } catch (err) {
      console.error(err);
      alert("Create folder failed");
    }
  };

  const handleDelete = async (subFolderId) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    try {
      await deleteFolder(subFolderId);
      toast.success("Folder deleted successfully!", { position: "top-right", autoClose: 4000 });
      fetchFolderInfo();
    } catch (err) {
      console.error(err);
      alert("Failed to delete folder");
    }
  };

  const openRename = (f) => {
    setEditingFolderId(f._id);
    setForm({ name: f.name, description: f.description || "" });
    setIsRenameOpen(true);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      await renameFolder(editingFolderId, { name: form.name });
      setIsRenameOpen(false);
      setEditingFolderId(null);
      toast.success("Folder Renamed successfully!", { position: "top-right", autoClose: 4000 });
      fetchFolderInfo();
    } catch (err) {
      console.error(err);
      alert("Rename failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container folder-page">
        {/* HEADER SECTION */}
        {/* HEADER SECTION */}
        <div className="folder-header mb-6">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft size={22} />
          </button>

          <div className="mt-4">
            <h2 className="text-2xl font-bold">
              {loadingFolder ? "Loading..." : folder?.name || "Folder"}
            </h2>
            <p className="muted">{folder?.description}</p>
          </div>
          {/* Share controls - visible to folder owner (this page is owner-only) */}
          <div style={{ marginLeft: "auto" }}>
            {folder?.isPublic ? (
              <button
                className="btn btn-ghost"
                onClick={async () => {
                  setShareLoading(true);
                  try {
                    await revokeFolderShare(id);
                    const { data } = await getFolderById(id);
                    setFolder(data);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setShareLoading(false);
                  }
                }}
                disabled={shareLoading}
              >
                {shareLoading ? "Working..." : "Make Private"}
              </button>
            ) : (
              <button
                className="btn"
                onClick={async () => {
                  setShareLoading(true);
                  try {
                    await createFolderShare(id);
                    const f = await getFolderById(id);
                    setFolder(f.data);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setShareLoading(false);
                  }
                }}
                disabled={shareLoading}
              >
                {shareLoading ? "Working..." : "Make Public"}
              </button>
            )}

            {folder?.isPublic &&
              folder?.shareToken &&
              (() => {
                const url = `${window.location.origin}/shared/folder/${folder.shareToken}`;
                return (
                  <div className="share-link-block">
                    <input
                      readOnly
                      value={url}
                      onFocus={(e) => e.target.select()}
                    />
                    <button onClick={() => navigator.clipboard.writeText(url)}>
                      Copy
                    </button>
                  </div>
                );
              })()}
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="folder-tabs-container">
          <button
            className={`folder-tab ${activeTab === "folders" ? "active" : ""}`}
            onClick={() => setActiveTab("folders")}
          >
            <FiFolder className="tab-icon" />
            <span>Folders</span>
          </button>
          <button
            className={`folder-tab ${activeTab === "problems" ? "active" : ""}`}
            onClick={() => setActiveTab("problems")}
          >
            <FiFolder className="tab-icon" />
            <span>Problems</span>
          </button>

          <button
            className={`folder-tab ${
              activeTab === "resources" ? "active" : ""
            }`}
            onClick={() => setActiveTab("resources")}
          >
            <FiFileText className="tab-icon" />
            <span>Resources</span>
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className="folder-content-area mt-6">
          {activeTab === "folders" ? (
            <div className="subfolders-section">
              <div className="subfolders-header" style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                <button className="btn-gradient" onClick={() => { setForm({name: "", description: ""}); setIsCreateOpen(true); }}>
                  <FiPlus /> New Folder
                </button>
              </div>
              {folder?.subfolders?.length === 0 ? (
                <div className="empty-state">
                  <h3>No subfolders</h3>
                  <p>Create a subfolder to organize this folder</p>
                </div>
              ) : (
                <div className="folder-grid">
                  {folder?.subfolders?.map((f) => (
                    <div
                      key={f._id}
                      className="folder-card"
                      onClick={() => navigate(`/folders/${f._id}`)}
                    >
                      <div className="folder-main folder-top">
                        <div className="folder-name">{f.name}</div>
                        <div className="folder-desc">{f.description}</div>
                      </div>
                      <div className="folder-bottom">
                        <div className="folder-actions">
                          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openRename(f); }}>
                            <FiEdit2 />
                          </button>
                          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleDelete(f._id); }}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "problems" ? (
            <ProblemList folderId={id} />
          ) : (
            <ResourceList folderId={id} />
          )}
        </div>

        {/* Create Folder Modal */}
        {isCreateOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create Subfolder</h2>
                <button className="close-btn" onClick={() => setIsCreateOpen(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Folder Name</label>
                  <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <input name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <button type="submit" className="btn-gradient full-width">Create Folder</button>
              </form>
            </div>
          </div>
        )}

        {/* Rename modal */}
        {isRenameOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Rename Folder</h2>
                <button className="close-btn" onClick={() => setIsRenameOpen(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleRename}>
                <div className="form-group">
                  <label>Folder Name</label>
                  <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <button type="submit" className="btn-gradient full-width">Rename</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Folder;
