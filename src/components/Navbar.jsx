import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../assets/assets";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [logOutModal, setLogOutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("board"); // Initialize active tab state
  const navigate = useNavigate();

  const openModal = () => setLogOutModal(true);
  const closeModal = () => setLogOutModal(false);

  const handleBoardClick = () => {
    setActiveTab("board");
    navigate("/dashboard");
  };

  const handleAnalyticsClick = () => {
    setActiveTab("analytics");
    navigate("analytics");
  };

  const handleSettingsClick = () => {
    setActiveTab("settings");
    navigate("settings");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-upper-content">
        <div className="sidebar-logo" onClick={handleBoardClick}>
          <img src={assets.logo} alt="Logo" />
          <span>Pro Manage</span>
        </div>

        <div className="sidebar-links">
          <span
            className={`sidebar-link-text ${
              activeTab === "board" ? "active" : ""
            }`}
            onClick={handleBoardClick}
          >
            <img src={assets.board} alt="Board Icon" />
            Board
          </span>
          <span
            className={`sidebar-link-text ${
              activeTab === "analytics" ? "active" : ""
            }`}
            onClick={handleAnalyticsClick}
          >
            <img src={assets.analytics} alt="Analytics Icon" />
            Analytics
          </span>
          <span
            className={`sidebar-link-text ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={handleSettingsClick}
          >
            <img src={assets.settings} alt="Settings Icon" />
            Settings
          </span>
        </div>
      </div>

      <div className="sidebar-lower-content">
        <span onClick={openModal} className="logout-link">
          <img src={assets.logout} alt="Logout Icon" /> Logout
        </span>
      </div>

      {/* Logout Modal */}
      <Logout logOutModal={logOutModal} closeModal={closeModal} />
    </div>
  );
}

export default Navbar;
