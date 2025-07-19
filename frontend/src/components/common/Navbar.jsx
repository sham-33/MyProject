import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  LogOut, 
  Heart, 
  Stethoscope, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">
                Hospital Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/doctors"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Find Doctors
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <Link
                      to="/login/patient"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Patient Login
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                    <Link
                      to="/login/doctor"
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Doctor Login
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4 text-purple-600" />
                    <Link
                      to="/register"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${userType === 'patient' ? 'bg-blue-600' : 'bg-green-600'}`}></div>
                  <span className="text-gray-700 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    userType === 'patient' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {userType}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/doctors"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Find Doctors
                  </Link>
                  <Link
                    to="/login/patient"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    <User className="h-4 w-4" />
                    <span>Patient Login</span>
                  </Link>
                  <Link
                    to="/login/doctor"
                    className="flex items-center space-x-2 text-green-600 hover:text-green-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Doctor Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700"
                    onClick={toggleMenu}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2">
                    <div className="text-sm text-gray-500">Logged in as:</div>
                    <div className="font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      userType === 'patient' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userType}
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
