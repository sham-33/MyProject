const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Appointment must be associated with a patient']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Appointment must be associated with a doctor']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  duration: {
    type: Number,
    default: 30, // Duration in minutes
    min: [15, 'Appointment duration must be at least 15 minutes'],
    max: [120, 'Appointment duration cannot exceed 120 minutes']
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for appointment'],
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  symptoms: {
    type: String,
    maxlength: [1000, 'Symptoms description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  consultationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  prescription: {
    type: String,
    maxlength: [2000, 'Prescription cannot be more than 2000 characters']
  },
  followUpDate: {
    type: Date
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'system']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot be more than 500 characters']
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

// Virtual for appointment full date time
appointmentSchema.virtual('fullDateTime').get(function() {
  if (this.appointmentDate && this.appointmentTime) {
    const [hours, minutes] = this.appointmentTime.split(':');
    const dateTime = new Date(this.appointmentDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
  }
  return null;
});

// Ensure virtual fields are serialized
appointmentSchema.set('toJSON', {
  virtuals: true
});

// Pre-save middleware to set consultation fee
appointmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.consultationFee) {
    const Doctor = mongoose.model('Doctor');
    const doctor = await Doctor.findById(this.doctor);
    if (doctor) {
      this.consultationFee = doctor.consultationFee;
    }
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
