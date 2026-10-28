import { API_BASE_URL } from "@/config";
import axios, { type AxiosResponse } from "axios";
import { handleMockApi } from "./mockBackend";

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

// Custom adapter that seamlessly serves mockBackend when running standalone on Vercel
axiosInstance.defaults.adapter = async (config) => {
  const isDefaultBase = !API_BASE_URL || API_BASE_URL === "/api/v1";

  if (!isDefaultBase) {
    try {
      const defaultAdapter = axios.getAdapter(axios.defaults.adapter || "xhr");
      const res = await defaultAdapter(config);
      const contentType = res.headers?.["content-type"] || "";
      if (!contentType.includes("text/html")) {
        return res;
      }
    } catch (err: any) {
      console.warn("Network request failed, falling back to local storage:", err?.message);
    }
  }

  // Small delay for natural feel
  await new Promise((resolve) => setTimeout(resolve, 60));

  let reqData = config.data;
  if (typeof reqData === "string") {
    try {
      reqData = JSON.parse(reqData);
    } catch {
      // Keep as string
    }
  }

  const { status, data } = await handleMockApi(
    config.method || "GET",
    config.url || "",
    reqData,
    config.params
  );

  const response: AxiosResponse = {
    data,
    status,
    statusText: status >= 200 && status < 300 ? "OK" : "Error",
    headers: { "content-type": "application/json" } as any,
    config,
    request: {},
  };

  if (status >= 400) {
    const error: any = new Error(data?.detail || "Request failed");
    error.response = response;
    error.config = config;
    throw error;
  }

  return response;
};

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
