const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, getDoctorProfile, updatePatientNote } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

// Register doctor
router.post('/register', registerDoctor);

// Login doctor
router.post('/login', loginDoctor);

// Get doctor profile (protected route)
router.get('/profile', protect, getDoctorProfile);

// Update patient consultation note (protected route)
router.put('/consultation/:patientId', protect, updatePatientNote);

module.exports = router;
