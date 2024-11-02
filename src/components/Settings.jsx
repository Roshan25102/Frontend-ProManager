import React, { useState } from "react";
import "./Settings.css";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Settings() {
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Invalid name";
        break;
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.match(emailPattern)) error = "Invalid email format";
        break;
      case "newPassword":
        if (value.length < 8) error = "Must be at least 8 characters long";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check how many fields are being updated
    const fieldsToUpdate = [
      formData.name,
      formData.email,
      formData.oldPassword && formData.newPassword,
    ].filter(Boolean).length;

    // Only allow one field to be updated
    if (fieldsToUpdate > 1) {
      toast.error("Only 1 field can be updated at a time.");
      return;
    }

    // Validate the form fields
    // if (!validateForm()) {
    //   toast.error("Please correct the errors before submitting.");
    //   return;
    // }

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/auth/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("User info updated successfully!");
        setFormData({ name: "", email: "", oldPassword: "", newPassword: "" });
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update user info.");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="Settings-main-container">
      <div className="setting-header">
        <p>Settings</p>
      </div>
      <div className="setting-Content">
        <form onSubmit={handleSubmit}>
          <div className="Settings-input-container">
            <input
              style={{
                backgroundImage: `url(${assets.name})`, // Name icon
              }}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />
            {errors.name && (
              <p className="settings-error-message">{errors.name}</p>
            )}
          </div>
          <div className="Settings-input-container">
            <input
              style={{
                backgroundImage: `url(${assets.emailIcon})`, // Email icon
              }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Update Email"
            />
            {errors.email && (
              <p className="settings-error-message">{errors.email}</p>
            )}
          </div>
          <div className="Settings-input-container">
            <input
              style={{
                backgroundImage: `url(${assets.password})`, // Password icon
              }}
              type={passwordVisible ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
            />
            <span onClick={togglePasswordVisibility}>
              <img
                className="password-eye-icons"
                src={passwordVisible ? assets.openEye : assets.closeEye}
                alt="Toggle Password Visibility"
              />
            </span>
          </div>
          <div className="Settings-input-container">
            <input
              style={{
                backgroundImage: `url(${assets.password})`, // Password icon
              }}
              type={confirmPasswordVisible ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
            <span onClick={toggleConfirmPasswordVisibility}>
              <img
                className="password-eye-icons"
                src={confirmPasswordVisible ? assets.openEye : assets.closeEye}
                alt="Toggle Password Visibility"
              />
            </span>
          </div>
          <button type="submit" className="settings-login-btn">
            Update
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Settings;
