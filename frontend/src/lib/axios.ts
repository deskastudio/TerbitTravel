// lib/axios.ts

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Sesuaikan dengan URL backend Anda
  headers: {
    "Content-Type": "application/json",
  },
  // Tambahkan konfigurasi timeout 
  timeout: 10000, // 10 detik
});

// Add a request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Log request untuk debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
instance.interceptors.response.use(
  (response) => {
    // Log success response untuk debugging
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Log error response untuk debugging
    console.error(`[API Error] ${error.config?.url || 'unknown'}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;