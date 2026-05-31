import React from "react";
import {
  FiUser,
  FiUsers,
  FiUploadCloud,
  FiBookmark,
  FiCalendar,
  FiShare2,
} from "react-icons/fi";
import "./MainSection.css";

const MainSection = () => {
  return (
    <main>
      {/* --- HERO PART --- */}
      <header className="hero-section" id="home">
        <div className="hero-icon-badge">💻</div>
        <h1 className="hero-title">
          All Your Coding <br />
          <span className="gradient-text">Challenges</span> <br />
          at One Place
        </h1>
        <p className="hero-text">
          Welcome to <span className="brand">StudySync</span>, Stop scattering
          your prep across different sites.
          <span className="line-break"></span>
          Save coding problems, upload your notes, and manage your study
          resources—all in one distraction-free dashboard.
        </p>
      </header>

      {/* --- FEATURES PART --- */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            Discover the powerful features that make coding practice effortless
          </p>
        </div>

        <div className="features-grid container">
          <FeatureCard
            icon={<FiUser />}
            color="pink"
            title="Customised User Profiles"
            desc="Users can create and customize their unique coding identity. They can add their coding handles and bio."
          />
          <FeatureCard
            icon={<FiUsers />}
            color="purple"
            title="Collaborative Learning"
            desc="Users can comment on each other's solutions and discuss optimal approaches in real-time."
          />
          <FeatureCard
            icon={<FiUploadCloud />}
            color="pink"
            title="Upload Coding Problems"
            desc="Users can upload their coding problems from various platforms and can discuss them."
          />
          <FeatureCard
            icon={<FiBookmark />}
            color="purple"
            title="Bookmark Coding Problems"
            desc="Save important problems for last-minute revision. Organize them with custom tags."
          />
          <FeatureCard
            icon={<FiCalendar />}
            color="pink"
            title="Comprehensive Contest Calendar"
            desc="Users can view upcoming contests from LeetCode, Codeforces, and more in a single view."
          />
          <FeatureCard
            icon={<FiShare2 />}
            color="purple"
            title="Sharable Folders"
            desc="Create folders of saved problems and share them with other users for collaborative practice."
          />
        </div>
      </section>
    </main>
  );
};

// Internal helper component for cleaner code
const FeatureCard = ({ icon, color, title, desc }) => (
  <div className="feature-card">
    <div className={`f-icon-box ${color}`}>{icon}</div>
    <div className="f-content">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  </div>
);

export default MainSection;
