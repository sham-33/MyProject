const express = require('express');
const {
  getMessages,
  getMessage,
  sendMessage,
  replyToMessage,
  markAsRead,
  markMultipleAsRead,
  deleteMessage,
  getMessageThread
} = require('../controllers/messageController');

const { protect } = require('../middleware/auth');
const {
  validateMessageCreation,
  validateMessageReply
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Message routes
router.get('/', getMessages);
router.post('/', validateMessageCreation, sendMessage);
router.get('/thread/:threadId', getMessageThread);
router.get('/:id', getMessage);
router.post('/:id/reply', validateMessageReply, replyToMessage);
router.put('/:id/read', markAsRead);
router.put('/mark-read', markMultipleAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;
