import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "./TaskModal.css"; // Modal CSS
import { assets } from "../assets/assets";

// Set the app root element for accessibility
Modal.setAppElement("#root");

function TaskModal({ isOpen, onClose, showToast, onProgressUpdate }) {
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const today = new Date().toISOString().split("T")[0];
  const priorityColor = {
    High: "#FF2473",
    Medium: "#18B0FF",
    Low: "#63C05B",
  };

  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState("To do");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [items, setItems] = useState([
    { id: Date.now(), text: "", checked: false },
  ]);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    // Fetch the user list from the backend
    const fetchAssignees = async () => {
      try {
        const response = await fetch(
          `${VITE_REACT_APP_BACKEND_URL}/api/auth/userlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT stored in localStorage
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assignees");
        }

        const data = await response.json();
        setAssignees(data); // Store the fetched data in the state
      } catch (error) {
        console.error("Error fetching assignees:", error);
      }
    };

    fetchAssignees();
  }, []);
  //fetch assignee close

  // Date Picker related

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Priority Related

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority);
  };

  const [assigneeDropdownVisible, setAssigneeDropdownVisible] = useState(false);

  const toggleAssigneeDropDownVisiblity = () => {
    setAssigneeDropdownVisible(!assigneeDropdownVisible);
  };

  const [searchText, setSearchText] = useState("");

  const assigneeSelect = useRef(null);
  const dropdownRef = useRef(null);

  const showDropdown = () => setAssigneeDropdownVisible(true);
  const hideDropdown = () => setAssigneeDropdownVisible(false);

  useEffect(() => {
    // Hide dropdown if clicking outside
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !assigneeSelect.current.contains(event.target)
      ) {
        hideDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   console.log(assignedTo);
  // }, [assignedTo]);

  const handleAssign = (assigneeValue, assigneeEmail) => {
    if (!assignedTo.includes(assigneeValue)) {
      setAssignedTo([...assignedTo, assigneeValue]);
    }
    setSearchText(assigneeEmail); // Set the input field to the assignee's email
    hideDropdown(); // Close the dropdown
  };

  const filteredAssignees = assignees.filter((assignee) =>
    assignee.email.toLowerCase().includes(searchText.toLowerCase())
  );

  //checklist functions

  // Function to add a new checklist item
  const addNewCheckPoint = (e) => {
    e.preventDefault(); // Prevent form submission
    setItems([...items, { id: Date.now(), text: "", checked: false }]);
  };

  const handleCheckboxChange = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleTextChange = (id, text) => {
    setItems(items.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Function to count checked checklist items
  const getCheckedCount = () => {
    return items.filter((item) => item.checked).length;
  };
  //checklist function end
  // Function to reset all form states
  const resetForm = () => {
    setTitle("");
    setProgress("To do");
    setSelectedPriority("");
    setSelectedDate("");
    setAssignedTo([]);
    setItems([{ id: Date.now(), text: "", checked: false }]);
    setSearchText("");
  };

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const checklist = items.map((item) => ({
      task: item.text,
      completed: item.checked,
    }));

    const taskData = {
      title,
      priority:
        selectedPriority === "high"
          ? 1
          : selectedPriority === "moderate"
          ? 2
          : 3,
      progress,
      assignedTo,
      checklist,
      dueDate: selectedDate,
    };

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      if (response.ok) {
        showToast.success("Task created successfully!");
        const data = await response.json();
        console.log("Task created successfully:", data);

        resetForm();
        onClose();
        onProgressUpdate();
      } else {
        showToast.error("Fill required mandatory fields");
        const errorData = await response.json();
        console.error("Failed to create task:", errorData);
      }
    } catch (error) {
      showToast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
      contentLabel="Task Modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="top">
          <label className="top-label">
            Title <span className="star">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="middle">
          <label>
            Select Priority <span className="star">*</span>
          </label>
          <div
            className={`priorityButton ${
              selectedPriority === "high" ? "selected" : ""
            }`}
            onClick={() => handlePrioritySelect("high")}
          >
            <div style={{ backgroundColor: priorityColor["High"] }}></div>HIGH
            PRIORITY
          </div>
          <div
            className={`priorityButton ${
              selectedPriority === "moderate" ? "selected" : ""
            }`}
            onClick={() => handlePrioritySelect("moderate")}
          >
            <div style={{ backgroundColor: priorityColor["Medium"] }}></div>
            MODERATE PRIORITY
          </div>
          <div
            className={`priorityButton ${
              selectedPriority === "low" ? "selected" : ""
            }`}
            onClick={() => handlePrioritySelect("low")}
          >
            <div style={{ backgroundColor: priorityColor["Low"] }}></div>LOW
            PRIORITY
          </div>
        </div>

        <div className="assignSection">
          <p>Assign to</p>
          <div>
            <input
              className="assignee-input-container"
              placeholder={searchText || "Add an assignee"}
              ref={assigneeSelect}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={showDropdown}
            />
            <img src={assets.downArrow} alt="" onClick={showDropdown} />
          </div>
        </div>
        {assigneeDropdownVisible && (
          <div className="assignee-dropdown-container" ref={dropdownRef}>
            {filteredAssignees.map((assignee, index) => (
              <div key={index} className="assignee-dropdown-inner-container">
                <div className="assignee-email-container">
                  <div>{assignee.initials}</div>
                  <p>{assignee.email}</p>
                </div>
                <button
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAssign(assignee.userId, assignee.email);
                  }}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="list">
          <label className="list-label">
            Checklist ({getCheckedCount()}/{items.length}){" "}
            <span className="star">*</span>
          </label>
          <div className="checklist-scroll-container">
            {items.map((item) => (
              <div className="list-item">
                <div>
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <input
                    type="text"
                    className="checklist-input"
                    placeholder="Type ..."
                    value={item.text}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                  />
                </div>
                <img
                  src={assets.cancel}
                  alt=""
                  className="task-delete-button"
                  onClick={() => handleDeleteItem(item.id)}
                />
              </div>
            ))}
            <button
              className="add-new-task"
              type="button"
              onClick={addNewCheckPoint}
            >
              + Add new
            </button>
          </div>
        </div>

        <div className="buttons">
          {/* Date picker */}
          <div className="date-picker-container">
            <button
              type="button"
              className="select-date-btn"
              onClick={() => document.getElementById("due-date").showPicker()}
            >
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-GB")
                : "Select Due Date"}
            </button>
            <input
              type="date"
              id="due-date"
              className="hidden-date-input"
              value={selectedDate}
              onChange={handleDateChange}
              min={today}
            />
          </div>

          <div className="">
            {/* Cancel button only triggers onClose */}
            <button
              id="red"
              type="button"
              href="/"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </button>
            <button type="submit" id="blue">
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default TaskModal;
