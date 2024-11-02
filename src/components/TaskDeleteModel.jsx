import React from "react";
import Modal from "react-modal";
import "../components/Logout.css";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: "335.19px",
    height: "200px",
    padding: "32px 18px 24px 18px",
  },
};

const TaskDeleteModel = ({ isOpen, onClose, handleDeleteTask }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
      contentLabel="Task Delete Modal"
      style={customStyles}
    >
      <div className="logout-content-container">
        <p>Are you sure you want to Delete?</p>
        <button id="yes" onClick={handleDeleteTask}>
          Yes, Delete
        </button>
        <button id="no" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default TaskDeleteModel;
