# MediLink - Patient-Doctor Healthcare Platform

A comprehensive healthcare platform that connects patients with doctors, enabling secure consultations, medical record management, and streamlined healthcare communication.

## Features

### For Patients:
- **Find Doctors**: Search and filter doctors by specialization, fees, and availability
- **Book Appointments**: Schedule appointments with available time slots
- **Appointment Management**: View, manage, and cancel appointments
- **Messaging**: Communicate with doctors and receive appointment responses
- **Profile Management**: Manage personal health information

### For Doctors:
- **Appointment Management**: View, accept, or reject appointment requests
- **Patient Communication**: Receive booking requests and communicate with patients
- **Schedule Management**: Set availability and manage time slots
- **Profile Management**: Update professional information and specializations

### System Features:
- **Real-time Messaging**: Appointment requests automatically create messages for doctors
- **Status Tracking**: Track appointment status (pending, confirmed, rejected, cancelled)
- **Email Notifications**: Automatic email notifications for appointment updates
- **Secure Authentication**: JWT-based authentication for both patients and doctors
- **Responsive Design**: Mobile-friendly interface
- Password reset via email
- Responsive patient dashboard

### For Doctors
- Professional registration with license verification
- Profile management with specialization details
- Hospital/clinic affiliation management
- Consultation fee settings
- Patient records access

### Security
- JWT cookie-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting and CORS protection

<!-- ## Quick Start

1. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Set up environment variables in `backend/.env`

3. Run the application:
   ```bash
   # Start backend (http://localhost:5000)
   cd backend && npm run dev

   # Start frontend (http://localhost:3000)
   cd frontend && npm run dev
   ```

## License

ISC License -->
