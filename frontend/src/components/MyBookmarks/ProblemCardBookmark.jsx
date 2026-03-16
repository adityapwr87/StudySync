import React, { useState } from "react";
import {
  FiTrash2,
  FiExternalLink,
  FiCode,
  FiEdit2,
  FiMic,
  FiImage,
} from "react-icons/fi";

const ProblemCardBookmark = ({ data, onRemove, onEdit, isRemoving }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="problem-card bookmark-card">
      {/* Card Top */}
      <div className="card-top">
        <h3 className="prob-title">{data.title}</h3>

        <div className="card-actions-top">
          {/* ✅ Edit Button */}
          <button
            className="btn-icon edit"
            onClick={() => onEdit(data)} // Pass full data to parent
          >
            <FiEdit2 />
          </button>

          <button
            className="btn-icon delete"
            onClick={() => onRemove(data._id)}
            disabled={isRemoving}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="tags-row">
        {(data.tags || []).map((tag, idx) => (
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

      {/* ✅ Audio Player (Only if audioUrl exists) */}
      {data.audioUrl && (
        <div className="audio-player-wrapper mt-3 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <FiMic /> <span>Voice Note</span>
          </div>
          <audio controls src={data.audioUrl} className="w-full h-8" />
        </div>
      )}

      {/* Solution + Image Toggles */}
      <div className="card-actions mt-2">
        {data.solution && (
          <button
            className={`btn-green ${showSolution ? "active" : ""}`}
            onClick={() => {
              setShowSolution(!showSolution);
              setShowImage(false);
            }}
          >
            <FiCode /> {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        )}

        {data.imageUrl && (
          <button
            className={`btn-green ml-2 ${showImage ? "active" : ""}`}
            onClick={() => {
              setShowImage(!showImage);
              setShowSolution(false);
            }}
          >
            <FiImage /> {showImage ? "Hide Image" : "Show Image"}
          </button>
        )}
      </div>

      {/* Solution Block */}
      {showSolution && (
        <div className="solution-box fade-in">
          <div className="solution-header">
            <span className="code-icon">&lt;/&gt;</span>
            <div className="solution-title">Solution</div>
          </div>
          <pre className="code-block">
            <code>{data.solution}</code>
          </pre>
        </div>
      )}

      {/* Image Block */}
      {showImage && data.imageUrl && (
        <div className="solution-box fade-in">
          <div className="solution-header">
            <span className="code-icon">🖼️</span>
            <div className="solution-title">Image</div>
          </div>
          <div className="image-block mt-2">
            <img
              src={data.imageUrl}
              alt={data.title || "bookmark image"}
              style={{ maxWidth: "100%", borderRadius: 6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemCardBookmark;
