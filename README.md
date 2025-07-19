# Hospital Management System - MERN Stack

This is a comprehensive hospital management system built with the MERN stack, featuring separate authentication and management for both patients and doctors.

## Features

### For Patients:
- User registration and authentication
- Secure login with JWT cookie-based authentication
- Profile management with medical history and emergency contacts
- Password reset functionality
- Responsive UI for all devices

### For Doctors:
- Professional registration with specialization and license verification
- Separate doctor authentication portal
- Comprehensive profile management
- Hospital/clinic affiliation details
- Consultation fee management
- Biography and professional information display

### Security Features:
- JWT cookie-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Secure password reset via email

## Tech Stack

### Backend:
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose ODM**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Express Validator** for input validation
- **Helmet** for security headers
- **Express Rate Limit** for API rate limiting

### Frontend:
- **React 19** with **Vite**
- **React Router DOM** for routing
- **React Hook Form** with **Yup** validation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MyProject
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration:**
   
   Create a `.env` file in the backend directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hospital_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   EMAIL_FROM=noreply@hospital.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=http://localhost:3000
   RESET_PASSWORD_EXPIRE=10
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Patient Endpoints:
- `POST /api/patients/register` - Register a new patient
- `POST /api/patients/login` - Patient login
- `GET /api/patients/me` - Get patient profile
- `PUT /api/patients/updatedetails` - Update patient details
- `PUT /api/patients/updatepassword` - Update patient password
- `POST /api/patients/forgotpassword` - Forgot password
- `PUT /api/patients/resetpassword/:token` - Reset password
- `GET /api/patients/logout` - Logout patient

### Doctor Endpoints:
- `POST /api/doctors/register` - Register a new doctor
- `POST /api/doctors/login` - Doctor login
- `GET /api/doctors` - Get all doctors (public)
- `GET /api/doctors/:id` - Get single doctor (public)
- `GET /api/doctors/me` - Get doctor profile
- `PUT /api/doctors/updatedetails` - Update doctor details
- `PUT /api/doctors/updatepassword` - Update doctor password
- `POST /api/doctors/forgotpassword` - Forgot password
- `PUT /api/doctors/resetpassword/:token` - Reset password
- `GET /api/doctors/logout` - Logout doctor

## Project Structure

```
MyProject/
├── backend/
│   ├── controllers/
│   │   ├── doctorController.js
│   │   └── patientController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Doctor.js
│   │   └── Patient.js
│   ├── routes/
│   │   ├── doctorRoutes.js
│   │   └── patientRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── sendTokenResponse.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Key Features Implementation

### Authentication System:
- Dual user type system (Patient/Doctor) with separate registration flows
- JWT tokens stored in HTTP-only cookies for security
- Comprehensive password reset flow with email notifications
- Protected routes with role-based access control

### Data Models:
- **Patient Model**: Includes personal information, medical history, emergency contacts, and address details
- **Doctor Model**: Includes professional information, specialization, license details, hospital affiliation, and consultation fees

### Frontend Features:
- Responsive design with Tailwind CSS
- Form validation with React Hook Form and Yup
- Context-based state management for authentication
- Real-time toast notifications
- Mobile-friendly navigation

### Security Implementation:
- Password hashing with bcrypt (salt rounds: 12)
- JWT token authentication with configurable expiration
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for secure cross-origin requests
- Helmet.js for security headers

## Development

### Available Scripts:

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any questions or support, please contact the development team.
