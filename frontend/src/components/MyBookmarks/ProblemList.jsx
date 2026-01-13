import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import ProblemCardBookmark from "./ProblemCardBookmark";
import AddBookmarkModal from "./AddBookmarkModal";
import EditBookmarkModal from "./EditBookmarkModal";
import { getBookmarksInFolder, removeBookmarkFromFolder } from "../../api/api";
import "./MyBookmarks.css";

const ProblemList = ({ folderId }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const { data } = await getBookmarksInFolder(folderId);
        setBookmarks(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };
    if (folderId) fetchBookmarks();
  }, [folderId]);

  const handleBookmarkAdded = (newBookmark) => {
    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleBookmarkUpdated = (updatedBookmark) => {
    setBookmarks((prev) =>
      prev.map((b) => (b._id === updatedBookmark._id ? updatedBookmark : b))
    );
  };

  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsEditOpen(true);
  };

  const handleRemove = async (bookmarkId) => {
    if (!window.confirm("Remove bookmark?")) return;
    try {
      setIsRemoving(true);
      await removeBookmarkFromFolder(folderId, bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      toast.success("Bookmark removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove bookmark");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="problem-list-container">
      {/* ADD BUTTON */}
      <div className="flex justify-end mb-4">
        <button className="btn-gradient" onClick={() => setIsAddOpen(true)}>
          <FiPlus /> Add Problem
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="loading-text">Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">
          <h3>No bookmarks yet</h3>
          <p>Add bookmarks using the button above</p>
        </div>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((b) => (
            <ProblemCardBookmark
              key={b._id}
              data={b}
              onRemove={handleRemove}
              onEdit={handleEditClick}
              isRemoving={isRemoving}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <AddBookmarkModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        folderId={folderId}
        onBookmarkAdded={handleBookmarkAdded}
      />

      {editingBookmark && (
        <EditBookmarkModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingBookmark(null);
          }}
          folderId={folderId}
          bookmarkData={editingBookmark}
          onBookmarkUpdated={handleBookmarkUpdated}
        />
      )}
    </div>
  );
};

export default ProblemList;
