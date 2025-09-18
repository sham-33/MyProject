const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id, userType: 'patient' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register patient
const registerPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if patient exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    // Create patient
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      password
    });

    // Create token
    const token = createToken(patient._id);

    // Set cookie
    res.cookie('token', token, {
      secure: process.env.NODE_ENV === "production" ? true : false, // false in local
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        consultationNote: patient.consultationNote
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login patient
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find patient
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = createToken(patient._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // false in local
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days,


    });

    res.json({
      success: true,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        consultationNote: patient.consultationNote
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get patient profile
const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    res.json({
      success: true,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        consultationNote: patient.consultationNote
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  getPatientProfile
};
