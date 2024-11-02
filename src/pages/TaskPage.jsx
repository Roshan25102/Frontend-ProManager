import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import "./TaskPage.css";

function TaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const priorityColor = {
    1: "#FF2473",
    2: "#18B0FF",
    3: "#63C05B",
  };

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await fetch(
          `${VITE_REACT_APP_BACKEND_URL}/api/tasks/${taskId}`
        );
        if (response.ok) {
          const data = await response.json();
          setTask(data.task);
        } else {
          console.error("Failed to fetch task");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
    fetchTask();
  }, [taskId]);

  if (!task) return <div>Loading...</div>;

  // Count completed checklist items
  const completedTasksCount = task.checklist.filter(
    (item) => item.completed
  ).length;

  function formatDate2(dateString) {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Extract the day and add the ordinal suffix
    const day = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(day);

    // Combine the month and day with suffix
    return formattedDate.replace(day, `${day}${ordinalSuffix}`);
  }

  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11, 12, 13
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    // <div>
    //   <h1>{task.title}</h1>
    //   <p>Priority: {task.priority}</p>
    //   <p>Progress: {task.progress}</p>
    //   <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
    //   {/* Display other task details */}
    // </div>
    <>
      <div className="task-page-main-container">
        <div className="task-page-logo-container">
          <img src={assets.logo} alt="" />
          <h1>Pro Manage</h1>
        </div>
        <div className="task-page-task-details-container">
          <div className="task-page-task-main-container">
            <div className="task-page-task-priority">
              <div
                className="priority-dot-container"
                style={{ backgroundColor: priorityColor[task.priority] }}
              />
              <span>
                {task.priority === 1
                  ? "HIGH "
                  : task.priority === 2
                  ? "MODERATE "
                  : "LOW "}
                PRIORITY
              </span>
            </div>

            <h1>{task.title}</h1>

            <h3>
              Checklist ({completedTasksCount}/{task.checklist.length})
            </h3>

            <div className="checklist task-page-checklist-main-container">
              {task.checklist.map((task, index) => (
                <div
                  key={index}
                  className="checklist-item task-page-checklist-item"
                >
                  <input
                    type="checkbox"
                    className="check"
                    checked={task.completed}
                  />
                  <p>{task.task}</p>
                </div>
              ))}
            </div>

            <div className="task-page-due-date-contianer">
              <p style={{ display: task.dueDate === null ? "none" : "block" }}>
                Due Date
              </p>
              <button
                style={{ display: task.dueDate === null ? "none" : "block" }}
              >
                {formatDate2(task.dueDate)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskPage;
