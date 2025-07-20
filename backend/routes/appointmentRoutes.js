const express = require('express');
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointment,
  getDoctorAvailability
} = require('../controllers/appointmentController');

const { protectPatient, protectDoctor, protect } = require('../middleware/auth');
const {
  validateAppointmentCreation,
  validateAppointmentStatusUpdate,
  validateAppointmentCancellation
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/doctor/:doctorId/availability', getDoctorAvailability);

// Protected routes - Patient
router.post('/', protectPatient, validateAppointmentCreation, createAppointment);
router.get('/patient', protectPatient, getPatientAppointments);

// Protected routes - Doctor
router.get('/doctor', protectDoctor, getDoctorAppointments);
router.put('/:id/status', protectDoctor, validateAppointmentStatusUpdate, updateAppointmentStatus);

// Protected routes - Both Patient and Doctor
router.get('/:id', protect, getAppointment);
router.put('/:id/cancel', protect, validateAppointmentCancellation, cancelAppointment);

module.exports = router;
