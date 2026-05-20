import React from "react";
import { FiFileText, FiLink, FiExternalLink } from "react-icons/fi";
import "./Folder.css";

const SharedResourceList = ({ resources }) => {
  return (
    <div className="resource-list-container">
      {/* READ ONLY DISPLAY */}
      {resources.length === 0 ? (
        <div className="empty-state">
          <h3>No resources yet</h3>
          <p>No resources in this shared folder</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedResourceList;
