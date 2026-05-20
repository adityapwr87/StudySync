import React from "react";
import ProblemCardBookmark from "./ProblemCardBookmark";
import "./MyBookmarks.css";

const SharedProblemList = ({ bookmarks }) => {
  return (
    <div className="problem-list-container">
      {/* CONTENT - READ ONLY */}
      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <h3>No bookmarks yet</h3>
          <p>No bookmarks in this shared folder</p>
        </div>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((b) => (
            <ProblemCardBookmark
              key={b._id}
              data={b}
              onRemove={null}
              onEdit={null}
              isRemoving={false}
              readOnly={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedProblemList;
