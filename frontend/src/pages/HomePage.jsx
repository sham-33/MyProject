import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user, userType } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">MediLink</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your simple healthcare management system. Connect with doctors, manage appointments, 
            and keep track of your health journey.
          </p>

          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                Welcome back, {user?.firstName}!
              </h2>
              
              {/* Healthcare Hero Image Section */}
              <div className="relative max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                    <div className="text-white space-y-6">
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                        Your Health Journey Starts Here
                      </h3>
                      <p className="text-blue-100 text-lg">
                        Connect with trusted healthcare professionals, manage your appointments seamlessly, and take control of your wellness journey with MediLink.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-100">24/7 Access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-100">Secure & Private</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-100">Expert Care</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Healthcare Illustration */}
                    <div className="relative">
                      <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                        <svg className="w-full h-64 text-white opacity-90" fill="currentColor" viewBox="0 0 400 300">
                          {/* Hospital Building */}
                          <rect x="50" y="120" width="300" height="150" fill="currentColor" opacity="0.8"/>
                          <rect x="60" y="130" width="280" height="130" fill="white" opacity="0.1"/>
                          
                          {/* Hospital Cross */}
                          <rect x="180" y="140" width="40" height="100" fill="#ef4444"/>
                          <rect x="160" y="160" width="80" height="20" fill="#ef4444"/>
                          
                          {/* Windows */}
                          <rect x="80" y="150" width="20" height="25" fill="white" opacity="0.3"/>
                          <rect x="110" y="150" width="20" height="25" fill="white" opacity="0.3"/>
                          <rect x="270" y="150" width="20" height="25" fill="white" opacity="0.3"/>
                          <rect x="300" y="150" width="20" height="25" fill="white" opacity="0.3"/>
                          
                          <rect x="80" y="190" width="20" height="25" fill="white" opacity="0.3"/>
                          <rect x="110" y="190" width="20" height="25" fill="white" opacity="0.3"/>
                          <rect x="270" y="190" width="20" height="25" fill="white" opacity="0.3"/>
                          <rect x="300" y="190" width="20" height="25" fill="white" opacity="0.3"/>
                          
                          {/* Doctor Figure */}
                          <circle cx="350" cy="80" r="15" fill="white" opacity="0.9"/>
                          <rect x="340" y="95" width="20" height="40" fill="white" opacity="0.9"/>
                          <rect x="335" y="100" width="30" height="25" fill="#3b82f6" opacity="0.8"/>
                          
                          {/* Stethoscope */}
                          <circle cx="365" cy="105" r="3" fill="#10b981"/>
                          <path d="M362 105 Q355 102 350 108" stroke="#10b981" strokeWidth="2" fill="none"/>
                          
                          {/* Medical Icons floating */}
                          <circle cx="120" cy="60" r="8" fill="white" opacity="0.6"/>
                          <rect x="116" y="56" width="8" height="8" fill="#3b82f6"/>
                          <rect x="118" y="54" width="4" height="12" fill="#3b82f6"/>
                          
                          <circle cx="280" cy="40" r="8" fill="white" opacity="0.6"/>
                          <path d="M276 36 L284 44 M276 44 L284 36" stroke="#ef4444" strokeWidth="2"/>
                        </svg>
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute -top-4 -right-4 bg-green-400 rounded-full p-3 animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      
                      <div className="absolute -bottom-4 -left-4 bg-red-400 rounded-full p-3 animate-pulse">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Healthcare Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Trusted Doctors</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">10k+</div>
                  <div className="text-gray-600">Happy Patients</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">Available Support</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
            <p className="text-gray-600">Simple registration process for both patients and doctors</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-4 8v6m-8-6h8m0 0h8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
            <p className="text-gray-600">Book appointments with your preferred doctors easily</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Health Records</h3>
            <p className="text-gray-600">Keep track of consultation notes and health information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
