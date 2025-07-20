import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Stethoscope, 
  User, 
  Clock, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  Calendar,
  Search,
  Mail,
  UserCheck
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user, userType } = useAuth();

  if (isAuthenticated) {
    return <Dashboard user={user} userType={userType} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">{/* Rest of the homepage for non-authenticated users */}
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with qualified doctors, manage your health records, and get the care you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register/patient"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <User className="mr-2 h-5 w-5" />
                Register as Patient
              </Link>
              <Link
                to="/register/doctor"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-blue-700 transition-colors"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                Register as Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive healthcare platform that connects patients with doctors seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Access
              </h3>
              <p className="text-gray-600">
                Access your health records and connect with doctors anytime, anywhere.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your health information is protected with the highest security standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Doctors
              </h3>
              <p className="text-gray-600">
                Connect with qualified and experienced healthcare professionals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Care
              </h3>
              <p className="text-gray-600">
                From consultations to follow-ups, get complete healthcare management.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600">
                All our doctors are verified and maintain the highest standards of care.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                <Stethoscope className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book appointments with your preferred doctors with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors who trust our platform for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 transition-colors"
            >
              Find Doctors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 transition-colors"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <Heart className="h-6 w-6 text-red-600 mr-2" />
            <span className="text-gray-900 font-semibold">Hospital Portal</span>
            <span className="text-gray-500 ml-4">© 2025 All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Dashboard component for authenticated users
const Dashboard = ({ user, userType }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-lg text-gray-600">
            {userType === 'patient' 
              ? 'Manage your health and connect with doctors'
              : 'Manage your patients and appointments'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userType === 'patient' ? (
            <>
              <DashboardCard
                title="Find Doctors"
                description="Search and book appointments with qualified doctors"
                icon={<Search className="h-8 w-8 text-blue-600" />}
                link="/doctors"
                color="blue"
              />
              <DashboardCard
                title="My Appointments"
                description="View and manage your scheduled appointments"
                icon={<Calendar className="h-8 w-8 text-green-600" />}
                link="/appointments"
                color="green"
              />
              <DashboardCard
                title="Messages"
                description="Communicate with your healthcare providers"
                icon={<Mail className="h-8 w-8 text-purple-600" />}
                link="/messages"
                color="purple"
              />
            </>
          ) : (
            <>
              <DashboardCard
                title="My Appointments"
                description="View and manage patient appointments"
                icon={<Calendar className="h-8 w-8 text-green-600" />}
                link="/appointments"
                color="green"
              />
              <DashboardCard
                title="Messages"
                description="View appointment requests and communicate with patients"
                icon={<Mail className="h-8 w-8 text-purple-600" />}
                link="/messages"
                color="purple"
              />
              <DashboardCard
                title="My Profile"
                description="Update your professional information"
                icon={<UserCheck className="h-8 w-8 text-blue-600" />}
                link="/profile"
                color="blue"
              />
            </>
          )}
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <p className={`font-medium capitalize ${
                userType === 'patient' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {userType}
              </p>
            </div>
            {userType === 'doctor' && user?.specialization && (
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-medium capitalize">
                  {user.specialization.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
            >
              Update Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card component
const DashboardCard = ({ title, description, icon, link, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 hover:bg-green-100 border-green-200',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    red: 'bg-red-50 hover:bg-red-100 border-red-200'
  };

  return (
    <Link to={link} className={`block p-6 rounded-lg border-2 transition-colors ${colorClasses[color]}`}>
      <div className="flex items-start space-x-4">
        <div>{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-gray-700">
            <span>Get started</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
