const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getAllDoctors, 
  getPatientAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// Book appointment (protected route - patient only)
router.post('/book', protect, bookAppointment);

// Get all doctors
router.get('/doctors', getAllDoctors);

// Get patient's appointments (protected route)
router.get('/patient', protect, getPatientAppointments);

// Get doctor's appointments (protected route)
router.get('/doctor', protect, getDoctorAppointments);

// Update appointment status (protected route - doctor only)
router.put('/:appointmentId/status', protect, updateAppointmentStatus);

module.exports = router;
