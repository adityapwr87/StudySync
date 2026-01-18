import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Added FiSearch to imports
import { FiPlus, FiTrash2, FiEdit2, FiArrowLeft, FiX, FiSearch } from "react-icons/fi";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import { toast } from "react-toastify";
import {
  getFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "../../api/api";
import "./MyBookmarks.css";

const MyBookmarks = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New State for Search
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingFolderId, setEditingFolderId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getFolders();
        setFolders(data);
      } catch (err) {
        console.error("Failed to load folders", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // --- LOGIC: Filter and Sort Alphabetically ---
  const filteredFolders = folders
    .filter((folder) => 
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const openCreate = () => {
    setForm({ name: "", description: "" });
    setIsCreateOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createFolder(form);
      setFolders((prev) => [data, ...prev]);
      setIsCreateOpen(false);
      toast.success("Folder Created successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // navigate(`/mybookmarks`); // Optional: usually stay on page to see result
    } catch (err) {
      console.error(err);
      alert("Create folder failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("All Bookmarks will be deleted. Are you sure you want to delete this folder?")) return;
    try {
      await deleteFolder(id);
      toast.success("Folder deleted successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFolders((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete folder");
    }
  };

  const openRename = (folder) => {
    setEditingFolderId(folder._id);
    setForm({ name: folder.name, description: folder.description || "" });
    setIsRenameOpen(true);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      const { data } = await renameFolder(editingFolderId, { name: form.name });
      setFolders((prev) => prev.map((f) => (f._id === data._id ? data : f)));
      setIsRenameOpen(false);
      setEditingFolderId(null);
      toast.success("Folder Renamed successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      alert("Rename failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bookmarks-container container">
        <div className="bookmarks-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft />
            </button>
            <div className="header-text">
              <h1>
                <span className="icon-stack">📁</span> My Folders
              </h1>
              <p>Organize your bookmarks into folders</p>
            </div>
          </div>
          
          <div className="header-right">
            {/* SEARCH BAR ADDED HERE */}
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="     Search folders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <button className="btn-gradient" onClick={openCreate}>
              <FiPlus /> New Folder
            </button>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading folders...</p>
        ) : folders.length === 0 ? (
          // State: User has no folders at all
          <div className="empty-state">
            <h3>No folders yet</h3>
            <p>Create a folder to organize your bookmarks</p>
            <button className="btn-gradient" onClick={openCreate}>
              <FiPlus /> Create Folder
            </button>
          </div>
        ) : filteredFolders.length === 0 ? (
           // State: User has folders, but search found nothing
           <div className="empty-state">
             <h3>No matching folders</h3>
             <p>Try searching for a different name</p>
             <button className="btn-text" onClick={() => setSearchQuery("")}>
               Clear Search
             </button>
           </div>
        ) : (
          <div className="folder-grid">
            {/* Map over filteredFolders instead of folders */}
            {filteredFolders.map((f) => (
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
                  <div className="folder-stats">
                    {typeof f.bookmarks !== "undefined" ? (
                      <span>{f.bookmarks.length} bookmarks</span>
                    ) : null}
                  </div>
                  <div className="folder-actions">
                    <button className="btn-icon" onClick={(e) =>{
                          e.stopPropagation(); 
                      openRename(f)}}>
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={(e) => {
                          e.stopPropagation(); 
                          handleDelete(f._id)
                        }
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Folder Modal */}
        {isCreateOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Folder</h2>
                <button
                  className="close-btn"
                  onClick={() => setIsCreateOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Folder Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn-gradient full-width">
                  Create Folder
                </button>
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
                <button
                  className="close-btn"
                  onClick={() => {setIsRenameOpen(false)}}
                >
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleRename}>
                <div className="form-group">
                  <label>Folder Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-gradient full-width">
                  Rename
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookmarks;