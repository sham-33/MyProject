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

    // Check if patient already has an existing appointment with this doctor
    const existingPatientAppointment = await Appointment.findOne({
      patient: patientId,
      doctor: doctorId,
      status: { $in: ['scheduled', 'completed'] }
    }).sort({ createdAt: -1 }); // Get the most recent appointment

    if (existingPatientAppointment) {
      // Update existing appointment with new reason, date, and time
      existingPatientAppointment.reasons.push({
        text: reason,
        date: new Date()
      });
      existingPatientAppointment.date = new Date(date);
      existingPatientAppointment.time = time;
      existingPatientAppointment.status = 'scheduled';
      
      await existingPatientAppointment.save();

      // Populate appointment with doctor and patient details
      const populatedAppointment = await Appointment.findById(existingPatientAppointment._id)
        .populate('doctor', 'firstName lastName specialization')
        .populate('patient', 'firstName lastName');

      return res.status(200).json({
        success: true,
        message: 'Appointment updated with new reason successfully',
        appointment: populatedAppointment
      });
    }

    // Check if appointment time is available (simple check)
    const existingTimeSlot = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: 'scheduled'
    });

    if (existingTimeSlot) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create new appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: new Date(date),
      time,
      reasons: [{
        text: reason,
        date: new Date()
      }]
    });

    // Populate appointment with doctor and patient details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'firstName lastName specialization')
      .populate('patient', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'New appointment booked successfully',
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

    // Format appointments with current reason for consistency
    const formattedAppointments = appointments.map(appointment => {
      const reasonsArray = appointment.reasons || [];
      const currentReason = reasonsArray.length > 0 ? reasonsArray[reasonsArray.length - 1] : null;

      return {
        ...appointment.toObject(),
        currentReason: currentReason,
        // Keep original reason field for backward compatibility
        reason: currentReason?.text || appointment.reason
      };
    });

    res.json({
      success: true,
      appointments: formattedAppointments
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get doctor appointments with detailed patient consultation history
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'firstName lastName')
      .sort({ date: 1 });

    // Format appointments with current and previous reasons
    const formattedAppointments = appointments.map(appointment => {
      const reasonsArray = appointment.reasons || [];
      const currentReason = reasonsArray.length > 0 ? reasonsArray[reasonsArray.length - 1] : null;
      const previousReasons = reasonsArray.slice(0, -1);

      return {
        ...appointment.toObject(),
        currentReason: currentReason,
        previousConsultations: previousReasons
      };
    });

    res.json({
      success: true,
      appointments: formattedAppointments
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add new reason to existing appointment
const addReasonToAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    const patientId = req.user.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the patient for this appointment
    if (appointment.patient.toString() !== patientId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Add new reason to the array
    appointment.reasons.push({
      text: reason,
      date: new Date()
    });

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
  updateAppointmentStatus,
  addReasonToAppointment
};
