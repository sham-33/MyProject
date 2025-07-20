const Message = require('../models/Message');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get user's messages
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { type, isRead, priority } = req.query;

    let query = { recipient: req.user.id };
    
    if (type) {
      query.messageType = type;
    }
    
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    
    if (priority) {
      query.priority = priority;
    }

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName specialization')
      .populate('appointment', 'appointmentDate appointmentTime reason status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({ 
      recipient: req.user.id, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      unreadCount,
      pages: Math.ceil(total / limit),
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'firstName lastName email specialization')
      .populate('recipient', 'firstName lastName email')
      .populate('appointment', 'appointmentDate appointmentTime reason status consultationFee');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user has access to this message
    if (message.sender._id.toString() !== req.user.id && 
        message.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this message'
      });
    }

    // Mark as read if recipient is viewing
    if (message.recipient._id.toString() === req.user.id && !message.isRead) {
      await message.markAsRead();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send new message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const {
      recipient,
      recipientModel,
      subject,
      content,
      messageType,
      priority,
      appointment
    } = req.body;

    // Validate recipient exists
    let recipientDoc;
    if (recipientModel === 'Doctor') {
      recipientDoc = await Doctor.findById(recipient);
    } else {
      recipientDoc = await Patient.findById(recipient);
    }

    if (!recipientDoc) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Determine sender model
    const senderModel = req.user.userType === 'doctor' ? 'Doctor' : 'Patient';

    const message = await Message.create({
      sender: req.user.id,
      senderModel,
      recipient,
      recipientModel,
      subject,
      content,
      messageType: messageType || 'general',
      priority: priority || 'normal',
      appointment
    });

    // Populate the created message
    await message.populate([
      { path: 'sender', select: 'firstName lastName specialization' },
      { path: 'recipient', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private
exports.replyToMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const parentMessageId = req.params.id;

    const parentMessage = await Message.findById(parentMessageId);
    if (!parentMessage) {
      return res.status(404).json({
        success: false,
        message: 'Original message not found'
      });
    }

    // Check if user has access to reply
    if (parentMessage.sender.toString() !== req.user.id && 
        parentMessage.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this message'
      });
    }

    // Determine reply recipient (opposite of current user)
    let replyRecipient, replyRecipientModel;
    if (parentMessage.sender.toString() === req.user.id) {
      replyRecipient = parentMessage.recipient;
      replyRecipientModel = parentMessage.recipientModel;
    } else {
      replyRecipient = parentMessage.sender;
      replyRecipientModel = parentMessage.senderModel;
    }

    const senderModel = req.user.userType === 'doctor' ? 'Doctor' : 'Patient';

    const replyMessage = await Message.create({
      sender: req.user.id,
      senderModel,
      recipient: replyRecipient,
      recipientModel: replyRecipientModel,
      subject: `Re: ${parentMessage.subject}`,
      content,
      messageType: parentMessage.messageType,
      priority: parentMessage.priority,
      appointment: parentMessage.appointment,
      parentMessage: parentMessageId,
      threadId: parentMessage.threadId
    });

    await replyMessage.populate([
      { path: 'sender', select: 'firstName lastName specialization' },
      { path: 'recipient', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: replyMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      });
    }

    await message.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark multiple messages as read
// @route   PUT /api/messages/mark-read
// @access  Private
exports.markMultipleAsRead = async (req, res, next) => {
  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message IDs array is required'
      });
    }

    const result = await Message.updateMany(
      {
        _id: { $in: messageIds },
        recipient: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user has access to delete (recipient only)
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get message thread
// @route   GET /api/messages/thread/:threadId
// @access  Private
exports.getMessageThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;

    const messages = await Message.find({
      threadId,
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    })
      .populate('sender', 'firstName lastName specialization')
      .populate('recipient', 'firstName lastName')
      .populate('appointment', 'appointmentDate appointmentTime reason status')
      .sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    // Mark unread messages as read
    const unreadMessages = messages.filter(msg => 
      msg.recipient.toString() === req.user.id && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(msg => msg._id) },
          recipient: req.user.id,
          isRead: false
        },
        {
          isRead: true,
          readAt: new Date()
        }
      );
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
