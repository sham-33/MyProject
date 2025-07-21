import { createContext, useContext, useReducer, useEffect } from 'react';
import { patientAPI, doctorAPI } from '../services/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  userType: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        userType: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const user = localStorage.getItem('user');

      if (token && userType && user) {
        try {
          // Verify token is still valid by making a request
          let response;
          if (userType === 'patient') {
            response = await patientAPI.getProfile();
          } else if (userType === 'doctor') {
            response = await doctorAPI.getProfile();
          }

          if (response?.data?.success) {
            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              payload: {
                user: response.data.data,
                userType,
                token,
              },
            });
          } else {
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('user');
            dispatch({ type: actionTypes.LOGOUT });
          }
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('user');
          dispatch({ type: actionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials, userType) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      let response;
      if (userType === 'patient') {
        response = await patientAPI.login(credentials);
      } else if (userType === 'doctor') {
        response = await doctorAPI.login(credentials);
      }

      if (response.data.success) {
        const { user, token, userType: responseUserType } = response.data;

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userType', responseUserType);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: {
            user,
            userType: responseUserType,
            token,
          },
        });

        toast.success(`Welcome back, ${user.firstName}!`);
        return { success: true };
      } else {
        // Handle case where response is received but success is false
        const message = response.data?.message || 'Login failed';
        dispatch({ type: actionTypes.SET_ERROR, payload: message });
        // Don't show toast here - let component handle the error display
        return { success: false, message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: message });
      // Don't show toast here - let component handle the error display
      return { success: false, message };
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Register function
  const register = async (userData, userType) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      let response;
      if (userType === 'patient') {
        response = await patientAPI.register(userData);
      } else if (userType === 'doctor') {
        response = await doctorAPI.register(userData);
      }

      if (response.data.success) {
        const { user, token, userType: responseUserType } = response.data;

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userType', responseUserType);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: {
            user,
            userType: responseUserType,
            token,
          },
        });

        toast.success(`Welcome, ${user.firstName}! Registration successful.`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.userType === 'patient') {
        await patientAPI.logout();
      } else if (state.userType === 'doctor') {
        await doctorAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      
      dispatch({ type: actionTypes.LOGOUT });
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      let response;
      if (state.userType === 'patient') {
        response = await patientAPI.updateProfile(userData);
      } else if (state.userType === 'doctor') {
        response = await doctorAPI.updateProfile(userData);
      }

      if (response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        dispatch({
          type: actionTypes.UPDATE_USER,
          payload: updatedUser,
        });
        
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      let response;
      if (state.userType === 'patient') {
        response = await patientAPI.updatePassword(passwordData);
      } else if (state.userType === 'doctor') {
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
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Forgot password
  const forgotPassword = async (email, userType) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
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
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Reset password
  const resetPassword = async (token, password, userType) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      let response;
      if (userType === 'patient') {
        response = await patientAPI.resetPassword(token, { password });
      } else if (userType === 'doctor') {
        response = await doctorAPI.resetPassword(token, { password });
      }

      if (response.data.success) {
        const { user, token: newToken, userType: responseUserType } = response.data;

        // Store in localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('userType', responseUserType);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: {
            user,
            userType: responseUserType,
            token: newToken,
          },
        });

        toast.success('Password reset successful');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    ...state,
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
