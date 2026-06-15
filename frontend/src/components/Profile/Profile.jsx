import React, { useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "../Dashboard/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../Dashboard/Footer/Footer";
import {
  FaEnvelope,
  FaUniversity,
  FaMapMarkerAlt,
  FaEdit,
  FaPlus,
  FaCode,
  FaTimes, // Used for close button
} from "react-icons/fa";
import {
  SiCodeforces,
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
} from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";

// Import your API methods
import { getMyProfile, updateMyProfile } from "../../api/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- State for Edit Profile Modal ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    city: "",
    bio: "",
    skills: "",
  });

  // --- State for Add Handle Modal ---
  const [isHandleModalOpen, setIsHandleModalOpen] = useState(false);
  const [handleData, setHandleData] = useState({
    platform: "Codeforces", // Default value
    handle: "",
    url: "",
  });

  // Helper to map DB platform strings to Icons and Colors
  const getPlatformConfig = (platformName) => {
    const lower = platformName?.toLowerCase();
    switch (lower) {
      case "codeforces":
        return { icon: <SiCodeforces />, color: "#1f8acb" };
      case "leetcode":
        return { icon: <SiLeetcode />, color: "#ffa116" };
      case "codechef":
        return { icon: <SiCodechef />, color: "#5b4638" };
      case "atcoder":
        return { icon: <FaCode />, color: "#fff" };
      case "geeksforgeeks":
        return { icon: <SiGeeksforgeeks />, color: "#2f8d46" };
      default:
        return { icon: <FiExternalLink />, color: "#fff" };
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getMyProfile();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- HANDLERS: Edit Profile ---

  const handleEditClick = () => {
    setFormData({
      name: user.name || "",
      college: user.college || "",
      city: user.city || "",
      bio: user.bio || "",
      skills: user.skills ? user.skills.join(", ") : "",
    });
    setIsEditing(true);
  };

  const handleLogout = () => {  
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Force page reload to clear state and go to home page
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const toastId=0;

    try {
      const formattedSkills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("college", formData.college);
      fd.append("city", formData.city);
      fd.append("bio", formData.bio);

      // ✅ send skills as array (multiple keys)
      formattedSkills.forEach((skill) => {
        fd.append("skills", skill);
      });

      if (profileImage) {
        fd.append("profileImage", profileImage);
      }
      const toastId = toast.info("Updating profile!!", {
        position: "top-right",
        autoClose:false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      const { data } = await updateMyProfile(fd);

     toast.dismiss(toastId);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setUser(data.user);
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
       toast.dismiss(toastId);
      console.error("Failed to update profile", error);
      alert("Something went wrong while updating.");
    }
  };

  // --- HANDLERS: Add Handle ---

  const handleHandleChange = (e) => {
    const { name, value } = e.target;
    setHandleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      // 1. Get existing handles (or empty array if none)
      const existingHandles = user.handles || [];

      // 2. Create the new updated list (Old + New)
      // We must send the *complete* array because the backend uses $set
      const updatedHandlesList = [...existingHandles, handleData];

      // 3. Send API Request
      const { data } = await updateMyProfile({
        handles: updatedHandlesList,
      });

      // 4. Update UI
      setUser(data.user);
      setIsHandleModalOpen(false);
      setHandleData({ platform: "Codeforces", handle: "", url: "" }); // Reset form
    } catch (error) {
      console.error("Failed to add handle", error);
      alert("Failed to add handle. Please check your inputs.");
    }
  };

  // Search submit redirects to /profile/:username
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/profile/${encodeURIComponent(q)}`);
  };

 return (
   <div>
     <Navbar />

     {loading ? (
       <div className="profile-loader-wrapper">
         <div className="circular-loader"></div>
       </div>
     ) : !user ? (
       <div className="error-screen">User not found</div>
     ) : (
       <>
         <div className="search-bar-container">
           <form className="user-search" onSubmit={handleSearchSubmit}>
             <input
               type="text"
               placeholder="Find a user"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="search-input"
               aria-label="Find an user"
             />
             <button type="submit" className="btn-send">
               search
             </button>
           </form>
         </div>
         <div className="profile-wrapper">
           <div className="profile-container">
             {/* --- LEFT SIDEBAR --- */}
             <div className="profile-sidebar">
               <div className="avatar-section">
                 <div className="avatar-ring">
                   <img
                     src={
                       user.profileImage || "https://via.placeholder.com/150"
                     }
                     alt="Profile"
                     className="avatar-img"
                   />
                 </div>
                 <h2 className="user-name">{user.name || "User Name"}</h2>
                 <p className="user-handle">@{user.username}</p>
               </div>

               <div className="action-buttons">
                 <button className="btn-primary" onClick={handleEditClick}>
                   <FaEdit /> Edit Profile
                 </button>
                 <button
                   className="btn-secondary"
                   onClick={() => setIsHandleModalOpen(true)}
                 >
                   <FaPlus /> Add Handle
                 </button>
               </div>

               <div className="profile-details">
                 <h3 className="section-label">
                   <span role="img" aria-label="doc">
                     📋
                   </span>{" "}
                   Profile Details
                 </h3>
                 <div className="detail-item">
                   <FaUniversity className="detail-icon" />
                   <span>{user.college || "Add College"}</span>
                 </div>
                 <div className="detail-item">
                   <FaMapMarkerAlt className="detail-icon" />
                   <span>{user.city || "Add City"}</span>
                 </div>
                 <div className="detail-item">
                   <FaEnvelope className="detail-icon" />
                   <span className="email-text">{user.email}</span>
                 </div>
               </div>
             </div>

             {/* --- RIGHT MAIN CONTENT --- */}
             <div className="profile-content">
               {/* About Me */}
               <section className="info-section">
                 <div className="logout-section">
                   <h3 className="section-title">💫 About Me</h3>
                   <button onClick={handleLogout} className="btn-logout">
                     LogOut
                   </button>
                 </div>
                 <div className="info-card">
                   <p>{user.bio || "No bio added yet."}</p>
                 </div>
               </section>

               {/* Coding Platforms */}
               <section className="info-section">
                 <h3 className="section-title">🔗 Coding Platforms</h3>
                 <div className="platforms-grid">
                   {user.handles && user.handles.length > 0 ? (
                     user.handles.map((handleObj, index) => {
                       const config = getPlatformConfig(handleObj.platform);
                       return (
                         <a
                           key={index}
                           href={handleObj.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="platform-card"
                         >
                           <div
                             className="platform-icon"
                             style={{ color: config.color }}
                           >
                             {config.icon}
                           </div>
                           <span className="platform-name">
                             {handleObj.platform}
                           </span>
                           <FiExternalLink className="link-icon" />
                         </a>
                       );
                     })
                   ) : (
                     <p className="empty-msg">No handles added yet.</p>
                   )}
                 </div>
               </section>

               {/* Skills */}
               <section className="info-section">
                 <h3 className="section-title">🚀 Skills</h3>
                 <div className="skills-container">
                   {user.skills && user.skills.length > 0 ? (
                     user.skills.map((skill, index) => (
                       <span key={index} className="skill-tag">
                         {skill}
                       </span>
                     ))
                   ) : (
                     <p className="empty-msg">No skills added.</p>
                   )}
                 </div>
               </section>
             </div>
           </div>

           {/* --- MODAL 1: EDIT PROFILE --- */}
           {isEditing && (
             <div className="modal-overlay" onClick={() => setIsEditing(false)}>
               <div
                 className="modal-content"
                 onClick={(e) => e.stopPropagation()}
               >
                 <div className="modal-header">
                   <h2>Edit Profile</h2>
                   <button
                     className="close-btn"
                     onClick={() => setIsEditing(false)}
                   >
                     <FaTimes />
                   </button>
                 </div>
                 <form onSubmit={handleUpdateSubmit} className="edit-form">
                   <div className="form-group">
                     <label>Full Name</label>
                     <input
                       type="text"
                       name="name"
                       className="form-input"
                       value={formData.name}
                       onChange={handleInputChange}
                     />
                   </div>
                   <div className="form-group">
                     <label>Bio</label>
                     <textarea
                       name="bio"
                       className="form-textarea"
                       value={formData.bio}
                       onChange={handleInputChange}
                     />
                   </div>
                   <div className="form-group">
                     <label>College</label>
                     <input
                       type="text"
                       name="college"
                       className="form-input"
                       value={formData.college}
                       onChange={handleInputChange}
                     />
                   </div>
                   <div className="form-group">
                     <label>City</label>
                     <input
                       type="text"
                       name="city"
                       className="form-input"
                       value={formData.city}
                       onChange={handleInputChange}
                     />
                   </div>
                   <div className="form-group">
                     <label>Skills (comma separated)</label>
                     <input
                       type="text"
                       name="skills"
                       className="form-input"
                       value={formData.skills}
                       onChange={handleInputChange}
                     />
                   </div>
                   <div className="form-group">
                     <label>Profile Photo</label>
                     <input
                       type="file"
                       accept="image/*"
                       className="form-input"
                       onChange={(e) => setProfileImage(e.target.files[0])}
                     />
                   </div>
                   <div className="modal-actions">
                     <button
                       type="button"
                       className="btn-cancel"
                       onClick={() => setIsEditing(false)}
                     >
                       Cancel
                     </button>
                     <button type="submit" className="btn-save">
                       Save Changes
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           )}

           {/* --- MODAL 2: ADD HANDLE --- */}
           {isHandleModalOpen && (
             <div
               className="modal-overlay"
               onClick={() => setIsHandleModalOpen(false)}
             >
               <div
                 className="modal-content"
                 onClick={(e) => e.stopPropagation()}
               >
                 <div className="modal-header">
                   <h2>Add Coding Handle</h2>
                   <button
                     className="close-btn"
                     onClick={() => setIsHandleModalOpen(false)}
                   >
                     <FaTimes />
                   </button>
                 </div>
                 <form onSubmit={handleSubmitHandle} className="edit-form">
                   <div className="form-group">
                     <label>Platform</label>
                     {/* Dropdown for standardized platforms */}
                     <select
                       name="platform"
                       className="form-input"
                       value={handleData.platform}
                       onChange={handleHandleChange}
                     >
                       <option value="Codeforces">Codeforces</option>
                       <option value="LeetCode">LeetCode</option>
                       <option value="CodeChef">CodeChef</option>
                       <option value="AtCoder">AtCoder</option>
                       <option value="GeeksForGeeks">GeeksForGeeks</option>
                       <option value="Other">Other</option>
                     </select>
                   </div>

                   <div className="form-group">
                     <label>Handle / Username</label>
                     <input
                       type="text"
                       name="handle"
                       className="form-input"
                       placeholder="e.g. sanyam_coder"
                       value={handleData.handle}
                       onChange={handleHandleChange}
                       required
                     />
                   </div>

                   <div className="form-group">
                     <label>Profile URL</label>
                     <input
                       type="url"
                       name="url"
                       className="form-input"
                       placeholder="https://codeforces.com/profile/..."
                       value={handleData.url}
                       onChange={handleHandleChange}
                       required
                     />
                   </div>

                   <div className="modal-actions">
                     <button
                       type="button"
                       className="btn-cancel"
                       onClick={() => setIsHandleModalOpen(false)}
                     >
                       Cancel
                     </button>
                     <button type="submit" className="btn-save">
                       Add Handle
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           )}
         </div>
       </>
     )}

     <Footer />
   </div>
 );
};

export default Profile;
