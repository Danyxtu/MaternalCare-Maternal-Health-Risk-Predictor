import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:3000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.email, role: payload.role });
      } catch (e) {
        console.error("Failed to decode token", e);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, role } = response.data;
      
      if (role?.toUpperCase() !== "ADMIN") {
        throw new Error("Access denied. Admin role required.");
      }

      setToken(newToken);
      localStorage.setItem("adminToken", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setUser({ email, role });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
