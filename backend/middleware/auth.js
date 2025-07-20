const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Protect routes - general authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Check for token in Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user based on userType
    let user;
    if (decoded.userType === 'patient') {
      user = await Patient.findById(decoded.id);
    } else if (decoded.userType === 'doctor') {
      user = await Doctor.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No user found with this token'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = user;
    req.user.userType = decoded.userType;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Authorize specific user types
exports.authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.userType)) {
      return res.status(403).json({
        success: false,
        message: `User type ${req.userType} is not authorized to access this route`
      });
    }
    next();
  };
};

// Protect patient routes
exports.protectPatient = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Patients only.'
      });
    }

    const patient = await Patient.findById(decoded.id);

    if (!patient || !patient.isActive) {
      return res.status(401).json({
        success: false,
        message: 'No patient found with this token or account is deactivated'
      });
    }

    req.user = patient;
    req.user.userType = 'patient';
    req.userType = 'patient';
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Protect doctor routes
exports.protectDoctor = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Doctors only.'
      });
    }

    const doctor = await Doctor.findById(decoded.id);

    if (!doctor || !doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'No doctor found with this token or account is deactivated'
      });
    }

    req.user = doctor;
    req.user.userType = 'doctor';
    req.userType = 'doctor';
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
