import React, { useEffect, useState, useCallback, useRef } from "react";
import { assets } from "../assets/assets";
import "./MainContent.css";
import { progressStages } from "../assets/assets";
import TaskContainer from "./TaskContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPeopleModal from "./AddPeopleModal";

function MainContent() {
  const userName = localStorage.getItem("name");
  const firstName = userName ? userName.split(" ")[0] : "";
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const openPeopleModal = () => {
    setIsPeopleModalOpen(true);
  };
  const closePeopleModal = () => setIsPeopleModalOpen(false);

  const [tasks, setTasks] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [taskFilter, setTaskFilter] = useState("All");
  const [taskFilterVisible, setTaskFilterVisible] = useState(false);
  // Fetch tasks data from the API on component mount
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/tasks/my-tasks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [VITE_REACT_APP_BACKEND_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, updateTrigger]);

  // Callback to be passed to child components
  const handleProgressUpdate = () => {
    setUpdateTrigger((prev) => !prev);
  };

  const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
  };

  const handleTaskFilter = (filter) => {
    setTaskFilter(filter);
    handleTaskFilterClick();
  };
  const handleTaskFilterClick = () => {
    setTaskFilterVisible(!taskFilterVisible);
  };

  // Function to filter tasks based on due date
  const filterTasksByDueDate = (tasks) => {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return tasks.filter((task) => {
      const taskDueDate = new Date(task.dueDate);

      if (taskFilter === "Today") {
        return taskDueDate.toDateString() === today.toDateString();
      } else if (taskFilter === "This week") {
        return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek;
      } else if (taskFilter === "This month") {
        return taskDueDate >= startOfMonth && taskDueDate <= endOfMonth;
      } else if (taskFilter === "All") {
        return true;
      }
      return true; // Show all tasks if no filter is selected
    });
  };

  const filterOptionsRef = useRef(null);
  // Handle outside click to close card options model
  const handleClickOutside = (event) => {
    if (
      filterOptionsRef.current &&
      !filterOptionsRef.current.contains(event.target)
    ) {
      setTaskFilterVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Add ordinal suffix for the day
    const suffix = (day) => {
      const j = day % 10,
        k = day % 100;
      if (j === 1 && k !== 11) {
        return day + "st";
      }
      if (j === 2 && k !== 12) {
        return day + "nd";
      }
      if (j === 3 && k !== 13) {
        return day + "rd";
      }
      return day + "th";
    };

    return `${suffix(day)} ${month}, ${year}`;
  };

  const TodayDate = () => {
    const today = new Date();
    return formatDate(today);
  };

  return (
    <div className="main-content-container">
      <div className="top-container">
        <div className="top-left">Welcome! {firstName}</div>
        <div className="top-right">{TodayDate()}</div>
      </div>

      <div className="middle-container">
        <div className="middle-left-container">
          <span id="middle-left-head">Board</span>
          <span id="middle-right-head" onClick={openPeopleModal}>
            <img src={assets.people} alt="" />
            Add People
          </span>
        </div>
        <span className="middle-right-container">
          {taskFilter}{" "}
          <img src={assets.downArrow} alt="" onClick={handleTaskFilterClick} />
          {taskFilterVisible && (
            <div className="filter-options-menu" ref={filterOptionsRef}>
              <div>
                {/* <span onClick={() => handleTaskFilter("All")}>All</span> */}
                <span onClick={() => handleTaskFilter("Today")}>Today</span>
                <span onClick={() => handleTaskFilter("This week")}>
                  This week
                </span>
                <span onClick={() => handleTaskFilter("This month")}>
                  This Month
                </span>
              </div>
            </div>
          )}
        </span>
      </div>

      <div className="bottom-container">
        {progressStages.map((stage) => {
          // Filter tasks based on the progress stage
          const filteredTasks = filterTasksByDueDate(
            tasks.filter((task) => task.progress === stage)
          );

          // Pass the filtered data to TaskContainer
          return (
            <TaskContainer
              key={stage}
              stage={stage}
              tasks={filteredTasks}
              onProgressUpdate={handleProgressUpdate}
              showToast={showToast}
            />
          );
        })}

        <span></span>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <AddPeopleModal
        isOpen={isPeopleModalOpen}
        onClose={closePeopleModal}
      ></AddPeopleModal>
    </div>
  );
}

export default MainContent;
