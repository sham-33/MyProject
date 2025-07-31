import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Heart, User, Stethoscope, CheckCircle } from 'lucide-react';

// Validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const { userType } = useParams();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email, userType);
    if (result.success) {
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Heart className="h-8 w-8 text-red-500 animate-float" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold text-gradient">MediLink</h1>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/70 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-3xl border border-white/20">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-blue-600">{submittedEmail}</span>
              </p>
              
              <div className="text-sm text-gray-500 mb-6">
                <p>• Check your spam folder if you don't see the email</p>
                <p>• The link will expire in 10 minutes</p>
                <p>• Make sure to use the latest email we sent</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-3 px-4 border border-blue-300 rounded-2xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Send Another Email
                </button>
                
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to login */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="h-8 w-8 text-red-500 animate-float" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-gradient">MediLink</h1>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/70 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-3xl border border-white/20">
          {/* User Type Display */}
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <div className={`flex items-center px-4 py-2 rounded-2xl border-2 ${
                userType === 'patient' 
                  ? 'border-blue-200 bg-blue-50 text-blue-700' 
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}>
                {userType === 'patient' ? (
                  <User className="h-5 w-5 mr-2" />
                ) : (
                  <Stethoscope className="h-5 w-5 mr-2" />
                )}
                <span className="font-semibold capitalize">{userType} Account</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/50'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Reset Link...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500">
              <p>Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
