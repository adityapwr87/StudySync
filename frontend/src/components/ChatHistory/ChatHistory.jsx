import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatHistory } from "../../api/api";
import "./ChatHistory.css"; // Import the CSS file here
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
const ChatHistory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getChatHistory();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load chats", err);
        setError("Could not load chat history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleChatClick = (user) => {
    navigate(`/chat/${user._id}`, { state: { user } });
  };

  return (
    <div>
      <Navbar />

      {loading ? (
        <div className="chat-loader-wrapper">
          <div className="circular-loader"></div>
          <p className="loader-text">Loading chats...</p>
        </div>
      ) : error ? (
        <div className="center-message">{error}</div>
      ) : (
        <>
          <div className="chat-history-page">
            <header className="chat-header2">
              <h2>Messages</h2>
            </header>

            <div className="chat-list">
              {users.length === 0 ? (
                <p className="empty-state">No conversations yet.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="chat-item"
                    onClick={() => handleChatClick(user)}
                  >
                    <div className="avatar-container">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="avatar"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="info-container">
                      <h3 className="user-name">{user.username}</h3>
                      <p className="user-status">Tap to start chatting</p>
                    </div>

                    <div className="arrow-icon">›</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default ChatHistory;
