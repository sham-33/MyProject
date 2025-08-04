const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id, userType: 'doctor' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register doctor
const registerDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialization } = req.body;

    // Check if doctor exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Create doctor
    const doctor = await Doctor.create({
      firstName,
      lastName,
      email,
      password,
      specialization
    });

    // Create token
    const token = createToken(doctor._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find doctor
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = createToken(doctor._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    res.json({
      success: true,
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all doctors (for patients to see)
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select('-password');
    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update patient consultation note (only doctors can do this)
const updatePatientNote = async (req, res) => {
  try {
    const { patientId, consultationNote } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { consultationNote },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Consultation note updated successfully',
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        consultationNote: patient.consultationNote
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all patients (for doctors to see)
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).select('-password');
    res.json({
      success: true,
      patients
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  getAllDoctors,
  updatePatientNote,
  getAllPatients
};
