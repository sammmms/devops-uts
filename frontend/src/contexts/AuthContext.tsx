import axiosInstance from "@/utils/axios_instance";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const isEmail = emailOrUsername.includes("@");
      const body = isEmail
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const response = await axiosInstance.post("/auth/login", body);

      const { access_token, user: userData } = response.data.data;

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("authUser", JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
    } catch (error: any) {
      console.error("Login Error Object:", error);

      let message = "Login failed";

      if (error.response) {
        const data = error.response.data;

        if (data?.detail) {
          const detail = data.detail;
          if (Array.isArray(detail)) {
            message = detail
              .map((err: any) => err.msg || JSON.stringify(err))
              .join("\n");
          } else if (typeof detail === "object") {
            message = JSON.stringify(detail);
          } else {
            message = String(detail);
          }
        } else if (data?.message) {
          message = data.message;
        } else if (typeof data === "string") {
          message = data;
        } else if (error.message) {
          message = error.message;
        }
      } else if (error.message) {
        message = error.message;
      }

      throw new Error(message);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        username,
        password,
      });

      const { access_token, user: userData } = response.data.data;

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("authUser", JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
    } catch (error: any) {
      let message = "Registration failed";

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          // Handle Pydantic validation errors
          message = detail
            .map((err: any) => err.msg || JSON.stringify(err))
            .join("\n");
        } else if (typeof detail === "object") {
          message = JSON.stringify(detail);
        } else {
          message = String(detail);
        }
      } else if (error.message) {
        message = error.message;
      }

      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
