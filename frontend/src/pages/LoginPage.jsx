import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Stethoscope, ArrowLeft, Mail, Lock, Heart } from 'lucide-react';

// Validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { userType } = useParams();
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(userType || 'patient');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data, event) => {
    // Explicitly prevent form submission default behavior
    if (event) {
      event.preventDefault();
    }
    
    // Clear previous errors
    setFieldErrors({});
    setGeneralError('');
    
    try {
      const result = await login(data, selectedUserType);
      
      if (result && result.success) {
        navigate('/profile');
      } else {
        const errorMessage = result?.message || 'Login failed';
        
        // Handle specific error cases
        if (errorMessage.toLowerCase().includes('password')) {
          setFieldErrors({ password: errorMessage });
        } else if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('account')) {
          setFieldErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('invalid') || 
                   errorMessage.toLowerCase().includes('credential') ||
                   errorMessage === 'Login failed') {
          // Show general "Invalid email or password" for generic failures
          setGeneralError('Invalid email or password. Please check your credentials and try again.');
        } else {
          // Show the specific error message in general error area
          setGeneralError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('An error occurred during login. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-16 w-16 text-red-500 float-animation" />
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-4">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600">
            Sign in to your account to continue
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/70 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-3xl border border-white/20">
          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I am a:
            </label>
            <div className="flex rounded-2xl overflow-hidden border border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedUserType('patient')}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all ${
                  selectedUserType === 'patient'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setSelectedUserType('doctor')}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all ${
                  selectedUserType === 'doctor'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor
              </button>
            </div>
          </div>

          <form 
            className="space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`appearance-none block w-full pl-12 pr-3 py-3 border rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email || fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {/* Show form validation error */}
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.email.message}
                </p>
              )}
              {/* Show field-specific error from login attempt */}
              {fieldErrors.email && !errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`appearance-none block w-full pl-12 pr-12 py-3 border rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.password || fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {/* Show form validation error */}
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.password.message}
                </p>
              )}
              {/* Show field-specific error from login attempt */}
              {fieldErrors.password && !errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to={`/forgot-password/${selectedUserType}`}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)(e);
                }}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* General Error Display */}
            {generalError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {generalError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Register CTA */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 rounded-full">New to HealthCare+?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/register/patient"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-blue-200 rounded-2xl shadow-sm bg-blue-50 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-all card-hover"
              >
                <User className="h-4 w-4 mr-2" />
                Patient
              </Link>
              <Link
                to="/register/doctor"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-green-200 rounded-2xl shadow-sm bg-green-50 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all card-hover"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
