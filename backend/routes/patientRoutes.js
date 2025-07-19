const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout
} = require('../controllers/patientController');

const { protectPatient } = require('../middleware/auth');
const {
  validatePatientRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validatePatientRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgotpassword', validateForgotPassword, forgotPassword);
router.put('/resetpassword/:resettoken', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', protectPatient, getMe);
router.put('/updatedetails', protectPatient, updateDetails);
router.put('/updatepassword', protectPatient, validateUpdatePassword, updatePassword);
router.get('/logout', protectPatient, logout);

module.exports = router;
