import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  LogOut, 
  Heart, 
  Stethoscope, 
  UserPlus,
  Menu,
  X,
  Calendar,
  Search,
  Mail,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Heart className="h-10 w-10 text-red-500 group-hover:text-red-600 transition-colors float-animation" />
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-600/30 transition-colors"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">
                  MediLink
                </span>
                <div className="text-xs text-gray-500 font-medium">Your Health Partner</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/doctors"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                >
                  <Search className="h-4 w-4" />
                  <span>Find Doctors</span>
                </Link>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-1">
                {userType === 'patient' && (
                  <Link
                    to="/doctors"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                  >
                    <Search className="h-4 w-4" />
                    <span>Find Doctors</span>
                  </Link>
                )}
                
                <Link
                  to="/appointments"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </Link>
                
                {userType === 'patient' && (
                  <Link
                    to="/consultations"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Consultations</span>
                  </Link>
                )}
                
                {userType === 'doctor' && (
                  <Link
                    to="/create-consultation"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>Create Record</span>
                  </Link>
                )}
                
                <Link
                  to="/messages"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50 relative"
                >
                  <Mail className="h-4 w-4" />
                  <span>Messages</span>
                  {/* Notification badge can be added here */}
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative ml-4">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${userType === 'patient' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className={`text-xs ${userType === 'patient' ? 'text-blue-600' : 'text-green-600'}`}>
                          {userType}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          userType === 'patient' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {userType}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 text-sm"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 text-sm w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
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
          <div className="lg:hidden border-t border-gray-100 mt-2">
            <div className="px-2 pt-4 pb-3 space-y-1 bg-white/50 backdrop-blur-sm rounded-2xl my-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/doctors"
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    <Search className="h-5 w-5" />
                    <span>Find Doctors</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 btn-primary text-white px-4 py-3 rounded-xl text-base font-medium mx-2"
                    onClick={toggleMenu}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${userType === 'patient' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className={`text-sm ${userType === 'patient' ? 'text-blue-600' : 'text-green-600'}`}>
                          {userType}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {userType === 'patient' && (
                    <Link
                      to="/doctors"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                      onClick={toggleMenu}
                    >
                      <Search className="h-5 w-5" />
                      <span>Find Doctors</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/appointments"
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </Link>
                  
                  {userType === 'patient' && (
                    <Link
                      to="/consultations"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                      onClick={toggleMenu}
                    >
                      <Stethoscope className="h-5 w-5" />
                      <span>Consultations</span>
                    </Link>
                  )}
                  
                  {userType === 'doctor' && (
                    <Link
                      to="/create-consultation"
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                      onClick={toggleMenu}
                    >
                      <Stethoscope className="h-5 w-5" />
                      <span>Create Record</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/messages"
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    <Mail className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl text-base font-medium w-full text-left transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
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
