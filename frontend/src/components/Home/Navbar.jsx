import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="home-navbar">
      <div className="navbar-container">
        {/* Logo / Branding */}
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="logo-icon">📚</span>
          <h1>StudySync</h1>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-signup" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
