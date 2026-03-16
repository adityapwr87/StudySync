import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import hook
import { FiUser } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // 2. Initialize hook

  // Helper to handle navigation and close mobile menu
  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* 1. LEFT: LOGO */}
      <div
        className="logo-section"
        onClick={() => handleNav("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-icon">
          <span className="logo-symbol">📚</span>
        </div>
        <span className="logo-text">CodeKeeper</span>
      </div>

      {/* 2. CENTER: NAV LINKS */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <span onClick={() => handleNav("/dashboard")} className="nav-item">
          Home
        </span>
        <span onClick={() => handleNav("/problems")} className="nav-item">
          Problems
        </span>
        <span onClick={() => handleNav("/chathistory")} className="nav-item">
          Social
        </span>
        <span onClick={() => handleNav("/calendar")} className="nav-item">
          Calendar
        </span>
        <span onClick={() => handleNav("/mybookmarks")} className="nav-item">
          MyBookmarks
        </span>
      </div>

      {/* 3. RIGHT: PROFILE & MOBILE TOGGLE */}
      <div className="navbar-right">
        {/* Profile Button - Now Navigates to /profile */}
        <div className="profile-btn" onClick={() => handleNav("/profile")}>
          <FiUser className="profile-icon" />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
