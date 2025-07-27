const { validationResult } = require('express-validator');
const Consultation = require('../models/Consultation');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Create a new consultation
// @route   POST /api/consultations
// @access  Private (Doctor only)
exports.createConsultation = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Ensure only doctors can create consultations
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create consultations'
      });
    }

    const {
      patientId,
      medicalCondition,
      symptoms,
      diagnosis,
      medications,
      vitals,
      followUpDate,
      consultationFee,
      consultationType
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const consultation = await Consultation.create({
      patient: patientId,
      doctor: req.user.id,
      medicalCondition,
      symptoms,
      diagnosis,
      medications,
      vitals,
      followUpDate,
      consultationFee,
      consultationType
    });

    // Populate doctor and patient details
    await consultation.populate([
      {
        path: 'doctor',
        select: 'firstName lastName email specialization'
      },
      {
        path: 'patient',
        select: 'firstName lastName email phone'
      }
    ]);

    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during consultation creation'
    });
  }
};

// @desc    Get patient's consultation history
// @route   GET /api/consultations/patient/:patientId
// @access  Private (Patient can view own, Doctor can view any)
exports.getPatientConsultations = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user can access this patient's consultations
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own consultations'
      });
    }

    const consultations = await Consultation.find({ 
      patient: patientId,
      isActive: true 
    })
      .populate({
        path: 'doctor',
        select: 'firstName lastName email specialization'
      })
      .populate({
        path: 'patient',
        select: 'firstName lastName email phone'
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Consultation.countDocuments({ 
      patient: patientId,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: consultations.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: consultations
    });
  } catch (error) {
    console.error('Get patient consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving consultations'
    });
  }
};

// @desc    Get doctor's consultation history
// @route   GET /api/consultations/doctor/:doctorId
// @access  Private (Doctor can view own only)
exports.getDoctorConsultations = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user can access this doctor's consultations
    if (req.user.role === 'doctor' && req.user.id !== doctorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own consultations'
      });
    }

    if (req.user.role === 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients cannot view doctor consultation lists'
      });
    }

    const consultations = await Consultation.find({ 
      doctor: doctorId,
      isActive: true 
    })
      .populate({
        path: 'doctor',
        select: 'firstName lastName email specialization'
      })
      .populate({
        path: 'patient',
        select: 'firstName lastName email phone'
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Consultation.countDocuments({ 
      doctor: doctorId,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: consultations.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: consultations
    });
  } catch (error) {
    console.error('Get doctor consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving consultations'
    });
  }
};

// @desc    Get latest consultation for a patient
// @route   GET /api/consultations/patient/:patientId/latest
// @access  Private (Patient can view own, Doctor can view any)
exports.getLatestConsultation = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Check if user can access this patient's consultations
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own consultations'
      });
    }

    const consultation = await Consultation.findOne({ 
      patient: patientId,
      isActive: true 
    })
      .populate({
        path: 'doctor',
        select: 'firstName lastName email specialization'
      })
      .populate({
        path: 'patient',
        select: 'firstName lastName email phone'
      })
      .sort({ createdAt: -1 });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'No consultation found for this patient'
      });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Get latest consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving latest consultation'
    });
  }
};

// @desc    Get single consultation by ID
// @route   GET /api/consultations/:id
// @access  Private (Patient can view own, Doctor can view any they created)
exports.getConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate({
        path: 'doctor',
        select: 'firstName lastName email specialization'
      })
      .populate({
        path: 'patient',
        select: 'firstName lastName email phone'
      });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check if user can access this consultation
    const canAccess = 
      (req.user.role === 'patient' && consultation.patient._id.toString() === req.user.id) ||
      (req.user.role === 'doctor' && consultation.doctor._id.toString() === req.user.id);

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this consultation'
      });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving consultation'
    });
  }
};

// @desc    Update consultation
// @route   PUT /api/consultations/:id
// @access  Private (Doctor who created it only)
exports.updateConsultation = async (req, res, next) => {
  try {
    let consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check if user is the doctor who created this consultation
    if (req.user.role !== 'doctor' || consultation.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update consultations you created'
      });
    }

    const updateFields = {
      medicalCondition: req.body.medicalCondition,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      vitals: req.body.vitals,
      followUpDate: req.body.followUpDate,
      consultationFee: req.body.consultationFee,
      consultationType: req.body.consultationType,
      status: req.body.status
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => 
      updateFields[key] === undefined && delete updateFields[key]
    );

    consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      {
        path: 'doctor',
        select: 'firstName lastName email specialization'
      },
      {
        path: 'patient',
        select: 'firstName lastName email phone'
      }
    ]);

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during consultation update'
    });
  }
};

// @desc    Delete (soft delete) consultation
// @route   DELETE /api/consultations/:id
// @access  Private (Doctor who created it only)
exports.deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check if user is the doctor who created this consultation
    if (req.user.role !== 'doctor' || consultation.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete consultations you created'
      });
    }

    // Soft delete
    consultation.isActive = false;
    await consultation.save();

    res.status(200).json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during consultation deletion'
    });
  }
};
