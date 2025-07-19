const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  getDoctors,
  getDoctor,
  logout
} = require('../controllers/doctorController');

const { protectDoctor } = require('../middleware/auth');
const {
  validateDoctorRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.post('/register', validateDoctorRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgotpassword', validateForgotPassword, forgotPassword);
router.put('/resetpassword/:resettoken', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', protectDoctor, getMe);
router.put('/updatedetails', protectDoctor, updateDetails);
router.put('/updatepassword', protectDoctor, validateUpdatePassword, updatePassword);
router.get('/logout', protectDoctor, logout);

module.exports = router;
