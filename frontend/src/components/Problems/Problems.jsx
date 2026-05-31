import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiBookmark,
  FiExternalLink,
  FiCode,
  FiMessageSquare,
  FiX,
  FiSend,
} from "react-icons/fi";
import {
  getProblems,
  addProblem,
  addComment,
  getFolders,
  addBookmarkToFolder,
} from "../../api/api";
import "./Problems.css";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    tags: "",
    solution: "",
  });

  // 2. FETCH PROBLEMS FROM API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await getProblems();
        setProblems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. HANDLE SUBMIT (SEND TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split tags string into array: "DP, Array" -> ["DP", "Array"]
      const problemPayload = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const { data } = await addProblem(problemPayload);
      toast.success("Problem added successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Update UI immediately
      setProblems([data, ...problems]);

      // Close Modal & Reset Form
      setIsModalOpen(false);
      setFormData({ title: "", link: "", tags: "", solution: "" });
    } catch (error) {
      console.error("Failed to add problem:", error);
      alert("Failed to add problem. Please check your inputs.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="problems-container container">
        {/* --- HEADER SECTION --- */}
        <div className="problems-header">
          <div className="header-text">
            <h1>
              <span className="icon-stack">📚</span> All Questions
            </h1>
            <p>Explore and bookmark coding challenges</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-gradient"
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus /> Add Question
            </button>
            <button
              onClick={() => navigate("/mybookmarks")}
              className="btn-outline btn-gradient"
            >
              <FiBookmark /> My Bookmarks
            </button>
          </div>
        </div>

        {/* --- PROBLEMS LIST --- */}
        <div className="problems-list">
          {loading ? (
            <p style={{ color: "white", textAlign: "center" }}>
              Loading problems...
            </p>
          ) : (
            problems.map((prob) => <ProblemCard key={prob._id} data={prob} />)
          )}
        </div>

        {/* --- ADD PROBLEM MODAL --- */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add New Problem</h2>
                <button
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Problem Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Two Sum"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Problem Link</label>
                  <input
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://leetcode.com/..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Arrays, DP, Stack"
                  />
                </div>
                <div className="form-group">
                  <label>Solution Code</label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    placeholder="Paste your optimized code here..."
                    rows="5"
                  ></textarea>
                </div>
                <button type="submit" className="btn-gradient full-width">
                  Save Problem
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


const ProblemCard = ({ data }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const navigate = useNavigate();
  // Loading state specifically for the bookmark button
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [foldersList, setFoldersList] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Local state for comments
  const [comments, setComments] = useState(data.comments || []);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);


  // Handle Post Comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const { data: updatedComments } = await addComment(data._id, {
        text: commentText,
      });

      setComments(updatedComments);
      setCommentText("");
      setLoading(false);
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
      setLoading(false);
    }
  };

  const openFolderModal = async () => {
    try {
      setIsFolderModalOpen(true);
      if (foldersList.length === 0) {
        const { data } = await getFolders();
        setFoldersList(data);
      }
    } catch (err) {
      console.error("Failed to fetch folders", err);
      alert("Failed to fetch folders");
    }
  };

  const handleAddToFolder = async (folderId) => {
    try {
      setIsBookmarking(true);
      const payload = {
        title: data.title,
        link: data.link,
        tags: data.tags || [],
        solution: data.solution || "",
        originalProblemId: data._id,
      };
      await addBookmarkToFolder(folderId, payload);
      setIsBookmarked(true);
      setIsFolderModalOpen(false);
      toast.success("Problem added To bookmark successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Failed to add bookmark to folder", err);
      alert("Failed to add bookmark to folder");
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="problem-card">
      {/* Card Top */}
      <div className="card-top">
        <h3 className="prob-title">{data.title}</h3>

        {/* --- UPDATED BUTTON --- */}
        <button
          className="btn-bookmark"
          disabled={isBookmarking || isBookmarked} // Disable click while loading or if already bookmarked
          onClick={() => openFolderModal()}
          style={{
            opacity: isBookmarking ? 0.7 : 1,
            cursor: isBookmarking ? "wait" : "pointer",
          }}
        >
          {isBookmarking ? (
            "Bookmarking..."
          ) : isBookmarked ? (
            "Bookmarked"
          ) : (
            <>
              <FiBookmark /> Bookmark
            </>
          )}
        </button>
      </div>

      {/* Tags */}
      <div className="tags-row">
        {data.tags.map((tag, idx) => (
          <span key={idx} className="tag-badge">
            # {tag}
          </span>
        ))}
      </div>

      {/* Link */}
      <a
        href={data.link}
        target="_blank"
        rel="noreferrer"
        className="prob-link"
      >
        <FiExternalLink /> View Problem
      </a>

      {/* Actions */}
      <div className="card-actions">
        {data.solution && (
          <button
            className={`btn-green ${showSolution ? "active" : ""}`}
            onClick={() => {
              setShowSolution(!showSolution);
              setShowDiscussion(false);
            }}
          >
            <FiCode /> {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        )}
        <button
          className={`btn-blue ${showDiscussion ? "active" : ""}`}
          onClick={() => {
            setShowDiscussion(!showDiscussion);
            setShowSolution(false);
          }}
        >
          <FiMessageSquare />{" "}
          {showDiscussion ? "Hide Discussion" : "Discussion"}
        </button>
      </div>

      {/* --- SOLUTION SECTION --- */}
      {showSolution && (
        <div className="solution-box fade-in">
          <div className="solution-header">
            <span className="code-icon">&lt;/&gt;</span>
            <div className="solution-title">Solution</div>
          </div>
          <pre className="code-block" aria-label="solution code">
            <code>{data.solution}</code>
          </pre>
        </div>
      )}

      {/* --- DISCUSSION SECTION --- */}
      {showDiscussion && (
        <div className="discussion-box fade-in">
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No discussion yet. Be the first!</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="comment-item">
                  <div
                    className="comment-avatar"
                    onClick={() => navigate(`/profile/${comment.username}`)}
                  >
                    {comment.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user" onClick={() => navigate(`/profile/${comment.username}`)}>{comment.username}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="comment-form" onSubmit={handlePostComment}>
            <input
              type="text"
              placeholder="Type your doubt or solution..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn-send" disabled={loading}>
              <FiSend />
            </button>
          </form>
        </div>
      )}
      {/* Folder selection modal for bookmarking */}
      {isFolderModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Folder</h2>
              <button
                className="close-btn"
                onClick={() => setIsFolderModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="form-group">
              {foldersList.length === 0 ? (
                <p>No folders found. Go to My Bookmarks to create one.</p>
              ) : (
                foldersList.map((f) => (
                  <div
                    key={f._id}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <strong style={{ color: "white" }}>{f.name}</strong>
                      <div style={{ color: "#b6b6c3", fontSize: 12 }}>
                        {f.description}
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn-gradient"
                        disabled={isBookmarking}
                        onClick={() => handleAddToFolder(f._id)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problems;
