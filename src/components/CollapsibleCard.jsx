import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import "./CollapsibleCard.css";
import TaskDeleteModel from "./TaskDeleteModel";

function CollapsibleCard({
  cardData,
  isCollapsed,
  onProgressUpdate,
  showToast,
  onEdit,
}) {
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const VITE_REACT_APP_FRONTEND_URL = import.meta.env
    .VITE_REACT_APP_FRONTEND_URL;
  const {
    _id,
    progress,
    priority,
    initials,
    title,
    dueDate,
    checklist,
    createdBy,
    assignedTo,
  } = cardData;
  const [isVisible, setIsVisible] = useState(false);
  const [cardOptionModel, setCardOptionModel] = useState(false);
  const [localChecklist, setLocalChecklist] = useState(checklist);

  const [isTaskDeketeModalOpen, setIsTaskDeketeModalOpen] = useState(false);

  const openTaskDeketeModal = () => setIsTaskDeketeModalOpen(true);
  const closeTaskDeketeModal = () => setIsTaskDeketeModalOpen(false);

  const togglecardOptionModel = () => {
    setCardOptionModel(!cardOptionModel);
  };

  useEffect(() => {
    setIsVisible(isCollapsed);
  }, [isCollapsed]);

  const priorityColor = {
    1: "#FF2473",
    2: "#18B0FF",
    3: "#63C05B",
  };

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

  const isDueDatePassed = (dueDate) => {
    const today = new Date();
    return new Date(dueDate) < today;
  };

  // calculate cehecklist completed true count
  function getCompletedTasksCount(checklist) {
    return checklist.filter((task) => task.completed).length;
  }

  const shareLink = async () => {
    const link = `${VITE_REACT_APP_FRONTEND_URL}/task/${_id}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      showToast.error("Failed to copy link.");
    }
  };

  async function updateTaskProgress(newProgress) {
    try {
      const response = await fetch(
        ` ${VITE_REACT_APP_BACKEND_URL}/api/tasks/update/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ progress: newProgress }),
        }
      );

      if (response.ok) {
        console.log(`Task ${title} updated to ${newProgress}`);
        showToast.success(`Task ${title} updated to ${newProgress}`);
        onProgressUpdate();
      } else {
        console.error("Failed to update task progress");
        showToast.success(`Task ${title} updated to ${newProgress}`);
        showToast.error("Failed to update task progress");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast.error("Failed to update task progress");
    }
  }

  // Checkbox toggle handler
  async function handleCheckboxChange(taskId, checked) {
    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/tasks/update/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            checklist: [{ _id: taskId, completed: checked }],
          }),
        }
      );

      if (response.ok) {
        showToast.success("Checklist item updated successfully");
        onProgressUpdate();
        // Update local checklist state
        setLocalChecklist((prev) =>
          prev.map((item) =>
            item._id === taskId ? { ...item, completed: checked } : item
          )
        );
      } else {
        showToast.error("Failed to update checklist item");
      }
    } catch (error) {
      console.error("Error updating checklist item:", error);
      showToast.error("Error updating checklist item");
    }
  }

  async function handleDeleteTask() {
    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/tasks/delete/${_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        showToast.success("Task deleted successfully");
        onProgressUpdate();
      } else {
        showToast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast.error("Error deleting task");
    }
  }

  const cardOptionsRef = useRef(null);
  // Handle outside click to close card options model
  const handleClickOutside = (event) => {
    if (
      cardOptionsRef.current &&
      !cardOptionsRef.current.contains(event.target)
    ) {
      setCardOptionModel(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const editDisabled = () => {
    return assignedTo[0] === createdBy;
  };

  return (
    <div className="card-container">
      <div className="card-first-container">
        <div className="first-left">
          <div
            className="priority-color"
            style={{ backgroundColor: priorityColor[priority] }}
          ></div>
          <p className="title">
            {priority === 1 ? "HIGH " : priority === 2 ? "MODERATE " : "LOW "}
            PRIORITY
          </p>
          <div
            className="person"
            style={{ display: initials === null ? "none" : "flex" }}
          >
            {initials}
          </div>
        </div>
        <img
          src={assets.threeDot}
          className="first-right"
          alt=""
          onClick={togglecardOptionModel}
        />
        {cardOptionModel && (
          <div className="card-options-model" ref={cardOptionsRef}>
            <div>
              <span
                onClick={() => !editDisabled() && onEdit()}
                // style={{ cursor: editDisabled() ? "pointer" : "not-allowed" }}
              >
                Edit
              </span>
              <span onClick={shareLink}>Share</span>
              <span style={{ color: "#CF3636" }} onClick={openTaskDeketeModal}>
                Delete
              </span>
            </div>
          </div>
        )}
      </div>

      <h1 className="card-second-container">{title}</h1>
      <div className="card-third-container ">
        <p>
          CheckList ({getCompletedTasksCount(checklist)}/{checklist.length})
        </p>
        <img
          src={assets.dropdownarrow}
          alt=""
          onClick={() => setIsVisible(!isVisible)}
          className={!isVisible ? "rotate" : ""}
        />
      </div>
      {isVisible && (
        <div className="checklist">
          {localChecklist.map((task, index) => (
            <div key={index} className="checklist-item">
              <input
                type="checkbox"
                className="check"
                checked={task.completed}
                onChange={(e) =>
                  handleCheckboxChange(task._id, e.target.checked)
                }
              />
              <p>{task.task}</p>
            </div>
          ))}
        </div>
      )}
      <div className="card-fouth-container">
        <div className="">
          {/* due date button background condition */}
          <button
            className="date progress-btn"
            style={{
              backgroundColor:
                progress === "Done"
                  ? "#63C05B"
                  : isDueDatePassed(dueDate)
                  ? "#CF3636"
                  : "#DBDBDB",
              color:
                progress === "Done" || isDueDatePassed(dueDate)
                  ? "#FFFFFF"
                  : "#5A5A5A",

              display: dueDate ? "block" : "none",
            }}
          >
            {formatDate2(dueDate)}
          </button>
        </div>
        <div className="progress-btn-container">
          {progress !== "Backlog" && (
            <button
              className="progress-btn"
              onClick={() => updateTaskProgress("Backlog")}
            >
              BACKLOG
            </button>
          )}
          {progress !== "To do" && (
            <button
              className="progress-btn"
              onClick={() => updateTaskProgress("To do")}
            >
              TO-DO
            </button>
          )}
          {progress !== "In progress" && (
            <button
              className="progress-btn"
              onClick={() => updateTaskProgress("In progress")}
            >
              PROGRESS
            </button>
          )}
          {progress !== "Done" && (
            <button
              className="progress-btn"
              onClick={() => updateTaskProgress("Done")}
            >
              DONE
            </button>
          )}
        </div>
      </div>
      <TaskDeleteModel
        isOpen={isTaskDeketeModalOpen}
        onClose={closeTaskDeketeModal}
        handleDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default CollapsibleCard;
