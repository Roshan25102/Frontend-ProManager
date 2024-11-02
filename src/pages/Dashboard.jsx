import React from "react";
import "./Dashboard.css";
import Navbar from "../components/Navbar";
import MainContent from "../components/MainContent";
import { Outlet } from "react-router-dom";
function Dashboard() {
  return (
    <div className="main-container">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
}

export default Dashboard;
