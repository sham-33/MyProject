const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  medicalCondition: {
    type: String,
    required: [true, 'Please provide medical condition'],
    trim: true,
    maxlength: [200, 'Medical condition cannot be more than 200 characters']
  },
  symptoms: [{
    symptom: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    duration: {
      type: String,
      trim: true
    }
  }],
  diagnosis: {
    primaryDiagnosis: {
      type: String,
      required: [true, 'Please provide primary diagnosis'],
      trim: true,
      maxlength: [300, 'Primary diagnosis cannot be more than 300 characters']
    },
    secondaryDiagnosis: {
      type: String,
      trim: true,
      maxlength: [300, 'Secondary diagnosis cannot be more than 300 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Diagnosis notes cannot be more than 1000 characters']
    }
  },
  medications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    frequency: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    instructions: {
      type: String,
      trim: true
    }
  }],
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  followUpDate: {
    type: Date
  },
  consultationFee: {
    type: Number,
    min: 0
  },
  consultationType: {
    type: String,
    enum: ['in-person', 'video-call', 'phone-call'],
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'completed'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
consultationSchema.index({ patient: 1, createdAt: -1 });
consultationSchema.index({ doctor: 1, createdAt: -1 });

// Virtual for consultation duration
consultationSchema.virtual('consultationDuration').get(function() {
  if (this.updatedAt && this.createdAt) {
    return Math.round((this.updatedAt - this.createdAt) / (1000 * 60)); // Duration in minutes
  }
  return 0;
});

// Ensure virtual fields are serialized
consultationSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Consultation', consultationSchema);
