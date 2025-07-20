const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Message must have a sender'],
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Message must have a recipient'],
    refPath: 'recipientModel'
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor']
  },
  messageType: {
    type: String,
    enum: ['appointment_request', 'appointment_response', 'general', 'prescription', 'follow_up'],
    default: 'general'
  },
  subject: {
    type: String,
    required: [true, 'Please provide message subject'],
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide message content'],
    maxlength: [2000, 'Message content cannot be more than 2000 characters']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  threadId: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ appointment: 1 });
messageSchema.index({ threadId: 1 });
messageSchema.index({ isRead: 1 });

// Pre-save middleware to generate thread ID
messageSchema.pre('save', function(next) {
  if (this.isNew && !this.threadId) {
    if (this.parentMessage) {
      // Use parent's thread ID if it's a reply
      this.threadId = this.parentMessage.threadId;
    } else {
      // Generate new thread ID
      this.threadId = this._id.toString();
    }
  }
  next();
});

// Mark message as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
