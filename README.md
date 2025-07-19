# Hospital Management System - MERN Stack

A comprehensive hospital management system built with the MERN stack, featuring separate authentication and management for both patients and doctors.

## Features

### For Patients
- Registration and authentication with JWT
- Profile management with medical history
- Emergency contacts and address management
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

## Quick Start

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

ISC License
