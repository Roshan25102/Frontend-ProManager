import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    // console.log("Retrieved token from localStorage:", token);
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Authentication check is done
  }, []);

  const login = (token, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    // console.log("Token saved to localStorage:", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    // console.log("Token removed from localStorage");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
