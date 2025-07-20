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
  UserCheck,
  Star,
  Zap,
  Phone,
  MapPin,
  Activity,
  CheckCircle
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user, userType } = useAuth();

  if (isAuthenticated) {
    return <Dashboard user={user} userType={userType} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Heart className="h-20 w-20 text-red-500 float-animation" />
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Your Health,</span>
              <br />
              <span className="text-gray-900">Our Priority</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-600 leading-relaxed">
              Experience the future of healthcare with our AI-powered platform that connects you with qualified doctors, manages your health records, and provides personalized care.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register/patient"
                className="btn-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold flex items-center space-x-3 min-w-[200px] justify-center"
              >
                <User className="h-5 w-5" />
                <span>Find Doctors</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/register/doctor"
                className="btn-secondary text-white px-8 py-4 rounded-2xl text-lg font-semibold flex items-center space-x-3 min-w-[200px] justify-center"
              >
                <Stethoscope className="h-5 w-5" />
                <span>Join as Doctor</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">10K+</div>
                <div className="text-gray-600">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">500+</div>
                <div className="text-gray-600">Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">50K+</div>
                <div className="text-gray-600">Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-gradient">HealthCare+</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide a comprehensive healthcare platform that revolutionizes how patients and doctors connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-yellow-500" />}
              title="Instant Booking"
              description="Book appointments with your preferred doctors in seconds with our smart scheduling system."
              gradient="from-yellow-100 to-orange-100"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-500" />}
              title="Secure & Private"
              description="Your health information is protected with bank-level security and end-to-end encryption."
              gradient="from-green-100 to-emerald-100"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="Expert Doctors"
              description="Connect with certified and experienced healthcare professionals across all specialties."
              gradient="from-blue-100 to-cyan-100"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-purple-500" />}
              title="24/7 Access"
              description="Access your health records and connect with doctors anytime, anywhere in the world."
              gradient="from-purple-100 to-pink-100"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-red-500" />}
              title="Health Tracking"
              description="Monitor your health journey with comprehensive records and progress tracking."
              gradient="from-red-100 to-rose-100"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-indigo-500" />}
              title="Quality Assured"
              description="All our doctors are verified and maintain the highest standards of medical care."
              gradient="from-indigo-100 to-violet-100"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with healthcare that works for you in just three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              title="Create Account"
              description="Sign up as a patient or doctor and complete your profile with medical information."
              icon={<User className="h-8 w-8 text-white" />}
            />
            <StepCard
              step="2"
              title="Find & Book"
              description="Search for doctors by specialty, location, or availability and book your appointment."
              icon={<Search className="h-8 w-8 text-white" />}
            />
            <StepCard
              step="3"
              title="Get Care"
              description="Attend your appointment and receive quality healthcare with follow-up support."
              icon={<CheckCircle className="h-8 w-8 text-white" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of patients and doctors who trust our platform for their healthcare needs. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 card-hover"
            >
              Find Doctors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all hover:scale-105 card-hover"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold">HealthCare+</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing healthcare with technology. Connect with doctors, manage your health, and get the care you deserve.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/doctors" className="hover:text-white transition-colors">Find Doctors</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@healthcareplus.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Healthcare St, Medical City</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 HealthCare+. All rights reserved. Made with ❤️ for better healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className={`card-hover bg-gradient-to-br ${gradient} p-8 rounded-3xl border border-white/20 backdrop-blur-sm`}>
    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 card-shadow">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-700 leading-relaxed">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ step, title, description, icon }) => (
  <div className="text-center card-hover">
    <div className="relative mb-6">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto card-shadow">
        {icon}
      </div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {step}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Dashboard component for authenticated users
const Dashboard = ({ user, userType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-xl opacity-90">
                {userType === 'patient' 
                  ? 'Ready to take care of your health today?'
                  : 'Ready to help your patients today?'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {userType === 'patient' ? (
            <>
              <DashboardCard
                title="Find Doctors"
                description="Search and book appointments with qualified doctors"
                icon={<Search className="h-8 w-8 text-blue-600" />}
                link="/doctors"
                gradient="from-blue-100 to-cyan-100"
                color="blue"
              />
              <DashboardCard
                title="My Appointments"
                description="View and manage your scheduled appointments"
                icon={<Calendar className="h-8 w-8 text-green-600" />}
                link="/appointments"
                gradient="from-green-100 to-emerald-100"
                color="green"
              />
              <DashboardCard
                title="Messages"
                description="Communicate with your healthcare providers"
                icon={<Mail className="h-8 w-8 text-purple-600" />}
                link="/messages"
                gradient="from-purple-100 to-pink-100"
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
                gradient="from-green-100 to-emerald-100"
                color="green"
              />
              <DashboardCard
                title="Messages"
                description="View appointment requests and communicate with patients"
                icon={<Mail className="h-8 w-8 text-purple-600" />}
                link="/messages"
                gradient="from-purple-100 to-pink-100"
                color="purple"
              />
              <DashboardCard
                title="My Profile"
                description="Update your professional information"
                icon={<UserCheck className="h-8 w-8 text-blue-600" />}
                link="/profile"
                gradient="from-blue-100 to-cyan-100"
                color="blue"
              />
            </>
          )}
        </div>

        {/* Profile Overview */}
        <div className="bg-white rounded-3xl card-shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold ${userType === 'patient' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                userType === 'patient' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {userType}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Member Since:</span>
                  <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
                {userType === 'doctor' && user?.specialization && (
                  <div>
                    <span className="text-sm text-gray-600">Specialization:</span>
                    <p className="font-medium capitalize">{user.specialization.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Update Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card component
const DashboardCard = ({ title, description, icon, link, gradient, color }) => {
  return (
    <Link to={link} className={`block p-8 rounded-3xl bg-gradient-to-br ${gradient} border border-white/20 card-hover card-shadow`}>
      <div className="flex items-start space-x-4">
        <div className="bg-white p-3 rounded-2xl card-shadow">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{description}</p>
          <div className="flex items-center text-sm font-semibold text-gray-800">
            <span>Get started</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
