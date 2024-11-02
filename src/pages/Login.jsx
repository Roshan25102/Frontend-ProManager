import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import "./Login.css";
import HomePageBanner from "../components/HomePageBanner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  // States which handles password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // State which handles backend interaction
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  // States which handles form submission
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  // Function which handles password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function which handles form Submission
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/auth/login`,
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
        toast.success("Logged in successfully!");
        console.log("Token received:", data.token);

        login(data.token, data.name);
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
        setFormError(data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
      setFormError("Server error");
    }
  };

  // Function which handles Toggle between Login and Register
  const handleRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <HomePageBanner />

      <div className="login-section">
        <div className="header">
          <p>Login</p>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-container">
              <input
                style={{
                  backgroundImage: `url(${assets.emailIcon})`, // Email icon
                }}
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="error">
                {formError && <p className="error-message">{formError}</p>}
              </div>
            </div>

            {/* Password Input with Toggle Visibility */}
            <div className="input-container">
              <input
                style={{
                  backgroundImage: `url(${assets.password})`, // Password icon
                }}
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Eye Icon to Toggle Password Visibility */}
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
                {formError && <p className="error-message">{formError}</p>}
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn">
              Log in
            </button>
          </form>
        </div>

        {/* Register Section */}
        <div className="register">
          <p>Have no account yet?</p>
          <button className="register-btn" onClick={handleRedirect}>
            Register
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
