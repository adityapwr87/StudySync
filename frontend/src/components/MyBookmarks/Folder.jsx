import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFolder, FiFileText } from "react-icons/fi";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import {
  getFolderById,
  createFolderShare,
  revokeFolderShare,
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

  // STATE: Controls which tab is visible ('problems' or 'resources')
  const [activeTab, setActiveTab] = useState("problems");

  // Fetch only Folder Metadata (Name/Desc)
  useEffect(() => {
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
    fetchFolderInfo();
  }, [id]);

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
          {activeTab === "problems" ? (
            <ProblemList folderId={id} />
          ) : (
            <ResourceList folderId={id} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Folder;
