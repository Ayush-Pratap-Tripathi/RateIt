import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Configure axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      if (response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.put("/api/users/update-password", {
      oldPassword,
      newPassword,
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Failed to update password.";
  }
};

const value = {
  user,
  token,
  api,
  login,
  logout,
  updatePassword,
};


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};