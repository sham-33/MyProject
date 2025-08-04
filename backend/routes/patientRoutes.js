const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, getPatientProfile } = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

// Register patient
router.post('/register', registerPatient);

// Login patient
router.post('/login', loginPatient);

// Get patient profile (protected route)
router.get('/profile', protect, getPatientProfile);

module.exports = router;
