import React, { useEffect, useState } from "react";
import "./Analytics.css";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    progress: {
      backlog: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    },
    priority: {
      high: 0,
      moderate: 0,
      low: 0,
    },
    dueDateTasks: 0,
  });

  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(
          `${VITE_REACT_APP_BACKEND_URL}/api/analytics/task-analytics`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, [VITE_REACT_APP_BACKEND_URL]);

  return (
    <div className="analytics-main-container">
      <div className="analytics-header">
        <p>Analytics</p>
      </div>
      <div className="analytics-content">
        <div
          className="analytics-actual-content"
          id="analytics-actual-content-left"
        >
          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>Backlog Tasks</p>
            </div>
            <span className="analytics-right">
              {analyticsData.progress.backlog}
            </span>
          </div>

          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>To-do Tasks</p>
            </div>
            <span className="analytics-right">
              {analyticsData.progress.todo}
            </span>
          </div>

          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>In-Progress Tasks</p>
            </div>
            <span className="analytics-right">
              {analyticsData.progress.inProgress}
            </span>
          </div>

          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>Completed Tasks</p>
            </div>
            <span className="analytics-right">
              {analyticsData.progress.done}
            </span>
          </div>
        </div>

        <div
          className="analytics-actual-content"
          id="analytics-actual-content-right"
        >
          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>Low Priority</p>
            </div>
            <span className="analytics-right">
              {analyticsData.priority.low}
            </span>
          </div>

          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>Moderate Priority</p>
            </div>
            <span className="analytics-right">
              {analyticsData.priority.moderate}
            </span>
          </div>

          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>High Priority</p>
            </div>
            <span className="analytics-right">
              {analyticsData.priority.high}
            </span>
          </div>

          <div className="analytics">
            <div className="analytics-left">
              <span></span>
              <p>Due Date Tasks</p>
            </div>
            <span className="analytics-right">
              {analyticsData.dueDateTasks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
