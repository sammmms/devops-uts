import { API_BASE_URL } from "@/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url?.endsWith("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
