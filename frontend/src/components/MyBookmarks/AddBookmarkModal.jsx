import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { addBookmarkToFolder } from "../../api/api"; // Adjust path as needed
import AudioRecorder from "./AudioRecorder"; // Import your recorder

const AddBookmarkModal = ({ isOpen, onClose, folderId, onBookmarkAdded }) => {
  const [form, setForm] = useState({
    title: "",
    link: "",
    tags: "",
    solution: "",
  });
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare FormData
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("link", form.link);
    formData.append("solution", form.solution);
    formData.append("tags", form.tags); // Controller splits this string

    // 2. Append Audio if recorded
    if (audioBlob) {
      formData.append("audio", audioBlob, "voice-note.webm");
    }

    // 3. Append Image if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      // 3. API Call
      const { data } = await addBookmarkToFolder(folderId, formData);

      // 4. Success Handling
      toast.success("Bookmark added successfully!");
      onBookmarkAdded(data); // Update parent list
      handleClose(); // Reset & Close
    } catch (err) {
      console.error(err);
      toast.error("Failed to add bookmark");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ title: "", link: "", tags: "", solution: "" });
    setAudioBlob(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Bookmark</h2>
          <button className="close-btn" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Link</label>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          {/* ✅ Audio Recorder Section */}
          <div className="form-group">
            <label>Voice Logic (Optional)</label>
            <AudioRecorder onAudioStop={setAudioBlob} currentAudioUrl={null} />
          </div>

          <div className="form-group">
            <label>Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
          </div>

          <div className="form-group">
            <label>Solution (optional)</label>
            <textarea
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              rows="5"
            />
          </div>

          <button
            type="submit"
            className="btn-gradient full-width"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Bookmark"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
