const { body } = require('express-validator');

// Patient registration validation
exports.validatePatientRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot be more than 50 characters'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot be more than 50 characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
    
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
    
  body('address.street')
    .notEmpty()
    .withMessage('Street address is required'),
    
  body('address.city')
    .notEmpty()
    .withMessage('City is required'),
    
  body('address.state')
    .notEmpty()
    .withMessage('State is required'),
    
  body('address.zipCode')
    .matches(/^\d{5,6}$/)
    .withMessage('Please provide a valid zip code'),
    
  body('emergencyContact.name')
    .notEmpty()
    .withMessage('Emergency contact name is required'),
    
  body('emergencyContact.phone')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid emergency contact phone number'),
    
  body('emergencyContact.relationship')
    .notEmpty()
    .withMessage('Emergency contact relationship is required')
];

// Doctor registration validation
exports.validateDoctorRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot be more than 50 characters'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot be more than 50 characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
    
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
    
  body('specialization')
    .isIn([
      'cardiology', 'dermatology', 'endocrinology', 'gastroenterology',
      'neurology', 'oncology', 'orthopedics', 'pediatrics', 'psychiatry',
      'pulmonology', 'radiology', 'surgery', 'urology', 'general_medicine',
      'emergency_medicine', 'anesthesiology', 'pathology', 'ophthalmology',
      'otolaryngology'
    ])
    .withMessage('Please provide a valid specialization'),
    
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('Medical license number is required'),
    
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer'),
    
  body('hospital.name')
    .notEmpty()
    .withMessage('Hospital/clinic name is required'),
    
  body('consultationFee')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a non-negative number')
];

// Login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Forgot password validation
exports.validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

// Reset password validation
exports.validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Update password validation
exports.validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];
