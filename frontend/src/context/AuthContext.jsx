import { createContext, useContext, useState, useEffect } from 'react';
import { patientAPI, doctorAPI } from '../services/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from cookies on app start
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = Cookies.get('token');
      const savedUserType = Cookies.get('userType');
      const savedUser = Cookies.get('user');

      if (savedToken && savedUserType && savedUser) {
        try {
          // Set token for API calls
          setToken(savedToken);
          setUserType(savedUserType);

          // Verify token is still valid by making a request
          let response;
          if (savedUserType === 'patient') {
            response = await patientAPI.getProfile();
          } else if (savedUserType === 'doctor') {
            response = await doctorAPI.getProfile();
          }

          if (response?.data?.success) {
            setUser(response.data.data);
            setUserType(savedUserType);
            setToken(savedToken);
            setIsAuthenticated(true);
            setError(null);
          } else {
            // Clear invalid data
            Cookies.remove('token');
            Cookies.remove('userType');
            Cookies.remove('user');
            setUser(null);
            setUserType(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Clear invalid data
          Cookies.remove('token');
          Cookies.remove('userType');
          Cookies.remove('user');
          setUser(null);
          setUserType(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials, userType) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (userType === 'patient') {
        response = await patientAPI.login(credentials);
      } else if (userType === 'doctor') {
        response = await doctorAPI.login(credentials);
      }

      if (response.data.success) {
        const { user, token, userType: responseUserType } = response.data;

        // Store in cookies (expires in 7 days)
        const cookieOptions = { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' 
        };
        Cookies.set('token', token, cookieOptions);
        Cookies.set('userType', responseUserType, cookieOptions);
        Cookies.set('user', JSON.stringify(user), cookieOptions);

        setUser(user);
        setUserType(responseUserType);
        setToken(token);
        setIsAuthenticated(true);
        setError(null);

        toast.success(`Welcome back, ${user.firstName}!`);
        return { success: true };
      } else {
        const message = response.data?.message || 'Login failed';
        setError(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData, userType) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (userType === 'patient') {
        response = await patientAPI.register(userData);
      } else if (userType === 'doctor') {
        response = await doctorAPI.register(userData);
      }

      if (response.data.success) {
        const { user, token, userType: responseUserType } = response.data;

        // Store in cookies
        const cookieOptions = { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' 
        };
        Cookies.set('token', token, cookieOptions);
        Cookies.set('userType', responseUserType, cookieOptions);
        Cookies.set('user', JSON.stringify(user), cookieOptions);

        setUser(user);
        setUserType(responseUserType);
        setToken(token);
        setIsAuthenticated(true);
        setError(null);

        toast.success(`Welcome, ${user.firstName}! Registration successful.`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (userType === 'patient') {
        await patientAPI.logout();
      } else if (userType === 'doctor') {
        await doctorAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear cookies
      Cookies.remove('token');
      Cookies.remove('userType');
      Cookies.remove('user');
      
      setUser(null);
      setUserType(null);
      setToken(null);
      setIsAuthenticated(false);
      setError(null);
      
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      
      let response;
      if (userType === 'patient') {
        response = await patientAPI.updateProfile(userData);
      } else if (userType === 'doctor') {
        response = await doctorAPI.updateProfile(userData);
      }

      if (response.data.success) {
        const updatedUser = response.data.data;
        const cookieOptions = { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' 
        };
        Cookies.set('user', JSON.stringify(updatedUser), cookieOptions);
        
        setUser(updatedUser);
        
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      
      let response;
      if (userType === 'patient') {
        response = await patientAPI.updatePassword(passwordData);
      } else if (userType === 'doctor') {
        response = await doctorAPI.updatePassword(passwordData);
      }

      if (response.data.success) {
        toast.success('Password updated successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email, userType) => {
    try {
      setLoading(true);
      
      let response;
      if (userType === 'patient') {
        response = await patientAPI.forgotPassword({ email });
      } else if (userType === 'doctor') {
        response = await doctorAPI.forgotPassword({ email });
      }

      if (response.data.success) {
        toast.success('Password reset email sent successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password, userType) => {
    try {
      setLoading(true);
      
      let response;
      if (userType === 'patient') {
        response = await patientAPI.resetPassword(token, { password });
      } else if (userType === 'doctor') {
        response = await doctorAPI.resetPassword(token, { password });
      }

      if (response.data.success) {
        const { user, token: newToken, userType: responseUserType } = response.data;

        // Store in cookies
        const cookieOptions = { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' 
        };
        Cookies.set('token', newToken, cookieOptions);
        Cookies.set('userType', responseUserType, cookieOptions);
        Cookies.set('user', JSON.stringify(user), cookieOptions);

        setUser(user);
        setUserType(responseUserType);
        setToken(newToken);
        setIsAuthenticated(true);
        setError(null);

        toast.success('Password reset successful');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userType,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
