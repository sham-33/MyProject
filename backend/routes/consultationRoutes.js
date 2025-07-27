const express = require('express');
const {
  createConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  getLatestConsultation,
  getConsultation,
  updateConsultation,
  deleteConsultation
} = require('../controllers/consultationController');

const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const createConsultationValidation = [
  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isMongoId()
    .withMessage('Valid Patient ID is required'),
  body('medicalCondition')
    .notEmpty()
    .withMessage('Medical condition is required')
    .isLength({ max: 200 })
    .withMessage('Medical condition cannot exceed 200 characters'),
  body('diagnosis.primaryDiagnosis')
    .notEmpty()
    .withMessage('Primary diagnosis is required')
    .isLength({ max: 300 })
    .withMessage('Primary diagnosis cannot exceed 300 characters'),
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('At least one symptom is required'),
  body('symptoms.*.symptom')
    .notEmpty()
    .withMessage('Symptom description is required'),
  body('symptoms.*.severity')
    .optional()
    .isIn(['mild', 'moderate', 'severe'])
    .withMessage('Severity must be mild, moderate, or severe'),
  body('medications')
    .optional()
    .isArray()
    .withMessage('Medications must be an array'),
  body('medications.*.name')
    .if(body('medications').exists())
    .notEmpty()
    .withMessage('Medication name is required'),
  body('medications.*.dosage')
    .if(body('medications').exists())
    .notEmpty()
    .withMessage('Medication dosage is required'),
  body('medications.*.frequency')
    .if(body('medications').exists())
    .notEmpty()
    .withMessage('Medication frequency is required'),
  body('consultationType')
    .optional()
    .isIn(['in-person', 'video-call', 'phone-call'])
    .withMessage('Invalid consultation type'),
  body('consultationFee')
    .optional()
    .isNumeric()
    .withMessage('Consultation fee must be a number')
    .custom(value => value >= 0)
    .withMessage('Consultation fee cannot be negative')
];

const updateConsultationValidation = [
  body('medicalCondition')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Medical condition cannot exceed 200 characters'),
  body('diagnosis.primaryDiagnosis')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Primary diagnosis cannot exceed 300 characters'),
  body('symptoms.*.severity')
    .optional()
    .isIn(['mild', 'moderate', 'severe'])
    .withMessage('Severity must be mild, moderate, or severe'),
  body('consultationType')
    .optional()
    .isIn(['in-person', 'video-call', 'phone-call'])
    .withMessage('Invalid consultation type'),
  body('status')
    .optional()
    .isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid consultation status'),
  body('consultationFee')
    .optional()
    .isNumeric()
    .withMessage('Consultation fee must be a number')
    .custom(value => value >= 0)
    .withMessage('Consultation fee cannot be negative')
];

// Apply protection to all routes
router.use(protect);

// Routes
router
  .route('/')
  .post(createConsultationValidation, createConsultation);

router
  .route('/patient/:patientId')
  .get(getPatientConsultations);

router
  .route('/patient/:patientId/latest')
  .get(getLatestConsultation);

router
  .route('/doctor/:doctorId')
  .get(getDoctorConsultations);

router
  .route('/:id')
  .get(getConsultation)
  .put(updateConsultationValidation, updateConsultation)
  .delete(deleteConsultation);

module.exports = router;
