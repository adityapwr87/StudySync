import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiFolder, FiFileText } from "react-icons/fi";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import { getPublicFolder } from "../../api/api";
import SharedProblemList from "./SharedProblemList";
import SharedResourceList from "./SharedResourceList";
import "./Folder.css";

export default function SharedFolderView() {
  const { token } = useParams();
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("problems");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await getPublicFolder(token);
        setFolder(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load shared folder",
        );
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="container folder-page">
        {/* HEADER SECTION */}
        <div className="folder-header mb-6">
          <div className="mt-4">
            <h2 className="text-2xl font-bold">{folder?.name}</h2>
            <p className="muted">{folder?.description}</p>
            {folder?.user && (
              <p className="muted" style={{ marginTop: 8 }}>
                Shared by{" "}
                <a
                  href={`/profile/${folder.user.username}`}
                  style={{
                    color: "var(--primary, #3b82f6)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {folder.user.username}
                </a>
              </p>
            )}
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
            <SharedProblemList bookmarks={folder?.bookmarks || []} />
          ) : (
            <SharedResourceList resources={folder?.resources || []} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
