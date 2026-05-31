import React from "react";
import { FiExternalLink, FiLayers, FiLink, FiUsers } from "react-icons/fi"; // Added header icons
import { FaHeart } from "react-icons/fa"; // Added Heart icon
import {
  SiLeetcode,
  SiCodechef,
  SiGeeksforgeeks,
  SiCodeforces,
} from "react-icons/si";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        {/* Resources */}
        <div className="footer-col">
          <h4 className="footer-heading">
            <FiLayers className="heading-icon color-1" /> Resources
          </h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://github.com/adityapwr87/StudySync.git"
                target="_blank"
                rel="noreferrer"
              >
                Getting Started
              </a>
            </li>
            <li>
              <a
                href="https://github.com/adityapwr87/StudySync.git"
                target="_blank"
                rel="noreferrer"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="https://github.com/adityapwr87/StudySync.git"
                target="_blank"
                rel="noreferrer"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                href="https://github.com/adityapwr87/StudySync.git"
                target="_blank"
                rel="noreferrer"
              >
                API Reference
              </a>
            </li>
            <li>
              <a
                href="https://github.com/adityapwr87/StudySync.git"
                target="_blank"
                rel="noreferrer"
              >
                Community Forums
              </a>
            </li>
          </ul>
        </div>

        {/* Platforms */}
        <div className="footer-col">
          <h4 className="footer-heading">
            <FiLink className="heading-icon color-2" /> Platforms
          </h4>
          <ul className="footer-links">
            <li className="platform-link cf">
              <a
                href="https://codeforces.com/"
                target="_blank"
                rel="noreferrer"
              >
                <SiCodeforces className="brand-icon" /> Codeforces
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link lc">
              <a href="https://leetcode.com/" target="_blank" rel="noreferrer">
                <SiLeetcode className="brand-icon" /> Leetcode
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link gfg">
              <a
                href="https://www.geeksforgeeks.org/"
                target="_blank"
                rel="noreferrer"
              >
                <SiGeeksforgeeks className="brand-icon" /> Geeks for Geeks
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link at">
              <a href="https://atcoder.jp/" target="_blank" rel="noreferrer">
                <span className="at-badge">At</span> Atcoder
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link cc">
              <a
                href="https://www.codechef.com/"
                target="_blank"
                rel="noreferrer"
              >
                <SiCodechef className="brand-icon" /> Codechef
                <FiExternalLink className="link-arrow" />
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="footer-col">
          <h4 className="footer-heading">
            <FiUsers className="heading-icon color-3" /> Community
          </h4>
          <ul className="footer-links">
            <li>
              <a href="#">Events</a>
            </li>
            <li>
              <a href="#">Meetups</a>
            </li>
            <li>
              <a href="#">Conferences</a>
            </li>
            <li>
              <a href="#">Hackathons</a>
            </li>
            <li>
              <a href="#">Jobs</a>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER BOTTOM (Matches your Image) */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          {/* Left: Brand Identity */}
          <div className="footer-brand-area">
            <div className="brand-circle">B</div>
            <div className="brand-text">
              <span className="brand-name">BookMarker</span>
              <span className="brand-tagline">Code. Learn. Connect.</span>
            </div>
          </div>

          {/* Right: Copyright & Love */}
          <div className="footer-copyright-area">
            <p>
              © 2025 BookMarker. Made with <FaHeart className="heart-icon" />{" "}
              for developers
            </p>
            <span className="copyright-sub">Empowering coders worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
