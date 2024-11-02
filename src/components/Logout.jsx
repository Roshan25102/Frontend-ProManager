import React from "react";
import Modal from "react-modal";
import "../components/Logout.css"
import { useAuth } from "../context/AuthContext";

// Set the app root element for accessibility
Modal.setAppElement("#root");

const customStyles = {
  content: {
    width:"335.19px",
    height:"200px",
    padding:"32px 18px 24px 18px"
  },
};

function Logout({ logOutModal, closeModal }) {

  const { logout } = useAuth();



  return (
    <Modal
      isOpen={logOutModal}
      onRequestClose={closeModal}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false}
      contentLabel="Logout Modal"
      style={customStyles}
    >
      <div className="logout-content-container">
        <p>Are you sure you want to logout?</p>
        <button id="yes" onClick={logout}>Yes, Logout</button>
        <button id="no" onClick={closeModal}>Cancel</button>
      </div>
    </Modal>
  );
}

export default Logout;
