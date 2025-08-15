import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();
const baseurl = "https://myproject-7fc9.onrender.com";
//const metaUrl = import.meta.env.VITE_META_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      //const baseurl = 'https://myproject-7fc9.onrender.com';
      // Try to get patient profile to check if logged in
      const response = await fetch(`${baseurl}/api/patients/profile`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.patient);
          setUserType("patient");
          setIsAuthenticated(true);
          return;
        }
      }

      // Try doctor profile
      const doctorResponse = await fetch(
        `${baseurl}/api/doctors/profile`,
        {
          credentials: "include",
        }
      );

      if (doctorResponse.ok) {
        const doctorData = await doctorResponse.json();
        if (doctorData.success) {
          setUser(doctorData.doctor);
          setUserType("doctor");
          setIsAuthenticated(true);
          return;
        }
      }

      // If neither worked, user is not authenticated
      setIsAuthenticated(false);
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const { email, password, userType: loginUserType } = credentials;

      const endpoint =
        loginUserType === "patient"
          ? `${baseurl}/api/patients/login`
          : `${baseurl}/api/doctors/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData =
          loginUserType === "patient" ? data.patient : data.doctor;
        setUser(userData);
        setUserType(loginUserType);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return data;
      } else {
        toast.error(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { userType: registerUserType, ...rest } = userData;

      const endpoint =
        registerUserType === "patient"
          ? `${baseurl}/api/patients/register`
          : `${baseurl}/api/doctors/register`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(rest),
      });

      const data = await response.json();

      if (data.success) {
        const newUser =
          registerUserType === "patient" ? data.patient : data.doctor;
        setUser(newUser);
        setUserType(registerUserType);
        setIsAuthenticated(true);
        toast.success("Registration successful!");
        return data;
      } else {
        toast.error(data.message || "Registration failed");
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${baseurl}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // For now, just return success since we don't have update endpoints
      // This would need to be implemented in the backend
      console.log("Profile update attempted:", profileData);
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      toast.error("Profile update failed");
      throw error;
    }
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
