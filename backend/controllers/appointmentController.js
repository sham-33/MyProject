const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Message = require('../models/Message');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.createAppointment = async (req, res, next) => {
  try {
    const {
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms,
      duration,
      isUrgent
    } = req.body;

    // Check if doctor exists
    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      symptoms,
      duration: duration || 30,
      isUrgent: isUrgent || false,
      consultationFee: doctorDoc.consultationFee
    });

    // Populate the appointment
    await appointment.populate([
      { path: 'patient', select: 'firstName lastName email phone' },
      { path: 'doctor', select: 'firstName lastName email specialization' }
    ]);

    // Create message notification for doctor
    await Message.create({
      sender: req.user.id,
      senderModel: 'Patient',
      recipient: doctor,
      recipientModel: 'Doctor',
      messageType: 'appointment_request',
      subject: `New Appointment Request - ${appointment.patient.firstName} ${appointment.patient.lastName}`,
      content: `You have received a new appointment request from ${appointment.patient.firstName} ${appointment.patient.lastName} for ${appointmentDate} at ${appointmentTime}. Reason: ${reason}`,
      appointment: appointment._id,
      priority: isUrgent ? 'urgent' : 'normal'
    });

    // Send email notification to doctor
    try {
      await sendEmail({
        email: doctorDoc.email,
        subject: 'New Appointment Request',
        message: `You have received a new appointment request from ${appointment.patient.firstName} ${appointment.patient.lastName} for ${appointmentDate} at ${appointmentTime}.`
      });
    } catch (emailError) {
      console.log('Email notification failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment request sent successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/patient
// @access  Private (Patient)
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = { patient: req.user.id };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'firstName lastName specialization hospital consultationFee')
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const date = req.query.date;

    let query = { doctor: req.user.id };
    if (status) {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone dateOfBirth gender')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update appointment status (Accept/Reject)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, notes } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if doctor owns this appointment
    if (appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Update appointment
    appointment.status = status;
    if (rejectionReason) {
      appointment.rejectionReason = rejectionReason;
    }
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    // Create message notification for patient
    const messageContent = status === 'confirmed' 
      ? `Your appointment request for ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been confirmed by Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}.`
      : `Your appointment request for ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been rejected by Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`;

    await Message.create({
      sender: req.user.id,
      senderModel: 'Doctor',
      recipient: appointment.patient._id,
      recipientModel: 'Patient',
      messageType: 'appointment_response',
      subject: `Appointment ${status === 'confirmed' ? 'Confirmed' : 'Rejected'}`,
      content: messageContent,
      appointment: appointment._id,
      priority: 'normal'
    });

    // Send email notification to patient
    try {
      await sendEmail({
        email: appointment.patient.email,
        subject: `Appointment ${status === 'confirmed' ? 'Confirmed' : 'Rejected'}`,
        message: messageContent
      });
    } catch (emailError) {
      console.log('Email notification failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient/Doctor)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user owns this appointment
    const isPatient = appointment.patient._id.toString() === req.user.id;
    const isDoctor = appointment.doctor._id.toString() === req.user.id;

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancelledBy = isPatient ? 'patient' : 'doctor';
    appointment.cancellationReason = cancellationReason;

    await appointment.save();

    // Create message notification
    const recipient = isPatient ? appointment.doctor._id : appointment.patient._id;
    const recipientModel = isPatient ? 'Doctor' : 'Patient';
    const senderName = isPatient 
      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
      : `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

    await Message.create({
      sender: req.user.id,
      senderModel: isPatient ? 'Patient' : 'Doctor',
      recipient,
      recipientModel,
      messageType: 'general',
      subject: 'Appointment Cancelled',
      content: `Your appointment for ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been cancelled by ${senderName}. ${cancellationReason ? `Reason: ${cancellationReason}` : ''}`,
      appointment: appointment._id,
      priority: 'normal'
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private (Patient/Doctor)
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone dateOfBirth gender address')
      .populate('doctor', 'firstName lastName email specialization hospital consultationFee');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const isPatient = appointment.patient._id.toString() === req.user.id;
    const isDoctor = appointment.doctor._id.toString() === req.user.id;

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get available time slots for a doctor
// @route   GET /api/appointments/doctor/:doctorId/availability
// @access  Public
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Find doctor's availability for the day
    const dayAvailability = doctor.availability.find(av => av.day === dayName);
    
    if (!dayAvailability) {
      return res.status(200).json({
        success: true,
        data: {
          availableSlots: [],
          message: 'Doctor is not available on this day'
        }
      });
    }

    // Get existing appointments for the date
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate,
      status: { $in: ['pending', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate time slots
    const slots = generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime, 30);
    
    // Filter out booked slots
    const availableSlots = slots.filter(slot => {
      return !existingAppointments.some(apt => apt.appointmentTime === slot);
    });

    res.status(200).json({
      success: true,
      data: {
        availableSlots,
        doctorAvailability: dayAvailability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const slots = [];
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  const current = new Date(start);
  
  while (current < end) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
  
  return slots;
}
