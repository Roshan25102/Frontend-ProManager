import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import HomePageBanner from "../components/HomePageBanner";

function Register() {
  // States which handles password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // States which handles form validation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  // State which handles backend interaction
  const navigate = useNavigate();
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  // Function which handles password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Function which handles Toggle between Login and Register
  const handleRedirect = () => {
    navigate("/login");
  };

  // Functions which handles form validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Invalid name";
        }
        break;
      case "email":
        if (!value.includes("@")) {
          error = "Email must contain '@'";
        } else if (!value.includes(".")) {
          error = "Email must contain a '.' after '@'";
        } else {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.match(emailPattern)) {
            error = "Invalid email format";
          }
        }
        break;

      case "password":
        if (value.length < 8) {
          error = "Must be at least 8 characters long";
        } else if (!/[A-Za-z]/.test(value)) {
          error = "Must contain at least one letter";
        } else if (!/\d/.test(value)) {
          error = "Must contain at least one number";
        } else if (!/[@$!%*?&]/.test(value)) {
          error = "Must contain at least one special character (@$!%*?&)";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          error = "Password doesn't match";
        }
        break;
      default:
        break;
    }
    // console.log("Validation error:", error);
    return error;
  };

  const validateForm = () => {
    const formErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        formErrors[key] = error;
      }
    });

    setErrors(formErrors);
    // console.log("Validation errors:", formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the error for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setErrors({});
        toast.success("Signed up successfully!");
        navigate("/login");
      } else {
        setFormError(data.message || "An error occurred");
        toast.error("Failed to sign up");
      }
    } catch (error) {
      setFormError("Server error");
      toast.error("Server error");
    }
  };

  return (
    <div className="container">
      <HomePageBanner />

      <div className="login-section">
        <div className="header">
          <p>Register</p>
        </div>

        <div className="form">
          <form action="" method="POST" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="input-container">
              <input
                style={{
                  backgroundImage: `url(${assets.name})`, // Name icon
                }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <div className="error">
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
            </div>

            {/* Email Input */}
            <div className="input-container">
              <input
                style={{
                  backgroundImage: `url(${assets.emailIcon})`, // Email icon
                }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <div className="error">
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="input-container">
              <input
                style={{
                  backgroundImage: `url(${assets.password})`, // Password icon
                }}
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <span
                className="show-password"
                onClick={togglePasswordVisibility}
              >
                <img
                  src={passwordVisible ? assets.openEye : assets.closeEye}
                  alt="Toggle Password Visibility"
                />
              </span>
              <div className="error">
                {errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="input-container">
              <input
                style={{
                  backgroundImage: `url(${assets.password})`, // Password icon
                }}
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              <span
                className="show-password"
                onClick={toggleConfirmPasswordVisibility}
              >
                <img
                  src={
                    confirmPasswordVisible ? assets.openEye : assets.closeEye
                  }
                  alt="Toggle Password Visibility"
                />
              </span>
              <div className="error">
                {errors.confirmPassword && (
                  <p className="error-message">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn">
              Register
            </button>
          </form>
        </div>

        {/* Register Section */}
        <div className="register">
          <p>Have an account ?</p>
          <button className="register-btn" onClick={handleRedirect}>
            Log in
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Register;
