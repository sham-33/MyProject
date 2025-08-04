const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user.id;

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if appointment time is available (simple check)
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: 'scheduled'
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: new Date(date),
      time,
      reason
    });

    // Populate appointment with doctor and patient details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'firstName lastName specialization')
      .populate('patient', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all doctors for appointment booking
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get patient appointments
const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    
    const appointments = await Appointment.find({ patient: patientId })
      .populate('doctor', 'firstName lastName specialization')
      .sort({ date: 1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get doctor appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'firstName lastName')
      .sort({ date: 1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the doctor for this appointment
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'firstName lastName specialization')
      .populate('patient', 'firstName lastName');

    res.json({
      success: true,
      appointment: updatedAppointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAllDoctors,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
