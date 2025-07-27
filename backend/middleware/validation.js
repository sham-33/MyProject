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
    
  // Optional fields with validation only if provided
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
    
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other')
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
    
  body('specialization')
    .isIn([
      'cardiology', 'dermatology', 'endocrinology', 'gastroenterology',
      'neurology', 'oncology', 'orthopedics', 'pediatrics', 'psychiatry',
      'pulmonology', 'radiology', 'surgery', 'urology', 'general_medicine',
      'emergency_medicine', 'anesthesiology', 'pathology', 'ophthalmology',
      'otolaryngology'
    ])
    .withMessage('Please provide a valid specialization'),
    
  // Optional fields with validation only if provided
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
    
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
    
  body('licenseNumber')
    .optional()
    .trim(),
    
  body('experience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer'),
    
  body('hospital')
    .optional()
    .trim(),
    
  body('consultationFee')
    .optional()
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

// Appointment creation validation
exports.validateAppointmentCreation = [
  body('doctor')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
    
  body('appointmentDate')
    .isISO8601()
    .withMessage('Please provide a valid appointment date')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (appointmentDate < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      
      // Don't allow appointments more than 3 months in advance
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      
      if (appointmentDate > maxDate) {
        throw new Error('Appointment date cannot be more than 3 months in advance');
      }
      
      return true;
    }),
    
  body('appointmentTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid appointment time in HH:MM format'),
    
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason for appointment is required')
    .isLength({ max: 500 })
    .withMessage('Reason cannot be more than 500 characters'),
    
  body('symptoms')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Symptoms description cannot be more than 1000 characters'),
    
  body('duration')
    .optional()
    .isInt({ min: 15, max: 120 })
    .withMessage('Duration must be between 15 and 120 minutes'),
    
  body('isUrgent')
    .optional()
    .isBoolean()
    .withMessage('isUrgent must be a boolean value')
];

// Appointment status update validation
exports.validateAppointmentStatusUpdate = [
  body('status')
    .isIn(['confirmed', 'rejected'])
    .withMessage('Status must be either confirmed or rejected'),
    
  body('rejectionReason')
    .if(body('status').equals('rejected'))
    .notEmpty()
    .withMessage('Rejection reason is required when rejecting appointment')
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot be more than 500 characters'),
    
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot be more than 1000 characters')
];

// Appointment cancellation validation
exports.validateAppointmentCancellation = [
  body('cancellationReason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason cannot be more than 500 characters')
];

// Message creation validation
exports.validateMessageCreation = [
  body('recipient')
    .isMongoId()
    .withMessage('Please provide a valid recipient ID'),
    
  body('recipientModel')
    .isIn(['Patient', 'Doctor'])
    .withMessage('Recipient model must be either Patient or Doctor'),
    
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Message subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot be more than 200 characters'),
    
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message content cannot be more than 2000 characters'),
    
  body('messageType')
    .optional()
    .isIn(['appointment_request', 'appointment_response', 'general', 'prescription', 'follow_up'])
    .withMessage('Invalid message type'),
    
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be low, normal, high, or urgent'),
    
  body('appointment')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid appointment ID')
];

// Message reply validation
exports.validateMessageReply = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Reply content is required')
    .isLength({ max: 2000 })
    .withMessage('Reply content cannot be more than 2000 characters')
];
