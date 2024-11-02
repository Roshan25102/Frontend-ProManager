import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import styles from "./AddPeopleModal.module.css";

Modal.setAppElement("#root");

function AddPeopleModal({ isOpen, onClose }) {
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const assigneeSelect = useRef(null);
  const dropdownRef = useRef(null);
  const [assignees, setAssignees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [assignedTo, setAssignedTo] = useState([]); // Store assigned users data
  const [assigneeDropdownVisible, setAssigneeDropdownVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State for success message
  const [lastAssignedEmail, setLastAssignedEmail] = useState(""); // Store the last assigned email

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await fetch(
          `${VITE_REACT_APP_BACKEND_URL}/api/auth/userlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assignees");
        }

        const data = await response.json();
        setAssignees(data);
      } catch (error) {
        console.error("Error fetching assignees:", error);
      }
    };

    fetchAssignees();
  }, [VITE_REACT_APP_BACKEND_URL]);

  const handleAssign = (assignee) => {
    // Add the assignee's ID and email to the assignedTo state
    if (!assignedTo.some((a) => a.userId === assignee.userId)) {
      setAssignedTo((prev) => [
        ...prev,
        { userId: assignee.userId, email: assignee.email },
      ]);
      setLastAssignedEmail(assignee.email); // Store the last assigned email
      setSearchText(assignee.email); // Update input with the assigned email
    }
    hideDropdown(); // Hide the dropdown after assigning
  };

  const filteredAssignees = assignees.filter((assignee) =>
    assignee.email.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
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

  const showDropdown = () => {
    if (searchText) {
      setAssigneeDropdownVisible(true);
    }
  };

  const hideDropdown = () => {
    setAssigneeDropdownVisible(false);
  };

  const handleAddEmail = async () => {
    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/auth/addPeople`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newAssigneeId: assignedTo.map((user) => user.userId), // Pass the array of user IDs
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add people");
      }

      const data = await response.json();
      console.log(data); // You can show a success message or handle UI updates here

      setIsSuccess(true); // Set success state to true
      setAssignedTo([]); // Reset assignedTo state after adding
      setSearchText(""); // Clear the search text
      hideDropdown(); // Hide the dropdown on success
    } catch (error) {
      console.error("Error adding people:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
      contentLabel="Add People Modal"
    >
      <div className={styles.peopleMainContainer}>
        {isSuccess ? (
          <>
            <p style={{ display: "flex", justifyContent: "center" }}>
              {lastAssignedEmail} added to board
            </p>
            <div
              className={`${styles.peopleButtons}`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                onClick={() => {
                  onClose();
                  setIsSuccess(false);
                  setLastAssignedEmail(""); // Clear the last assigned email
                  setSearchText(""); // Clear the search text
                }}
                className={styles.lastButton}
              >
                Okay, got it!
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Add people to the board</p>
            <input
              type="text"
              placeholder="Enter the email"
              ref={assigneeSelect}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                showDropdown();
              }}
              onFocus={showDropdown}
            />

            {assigneeDropdownVisible && (
              <div
                className={`assignee-dropdown-container ${styles.add_people_modal_assignee}`}
                ref={dropdownRef}
              >
                {filteredAssignees.map((assignee, index) => (
                  <div
                    key={index}
                    className="assignee-dropdown-inner-container"
                  >
                    <div className="assignee-email-container">
                      <div>{assignee.initials}</div>
                      <p>{assignee.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAssign(assignee);
                      }}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className={`${styles.peopleButtons}`}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleAddEmail}>Add Email</button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default AddPeopleModal;
