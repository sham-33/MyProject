import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MailOpen, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Reply
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user, userType } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, filter, searchTerm]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { type: filter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await api.get(`/messages?${queryParams}`);
      if (response.data.success) {
        setMessages(response.data.data);
        setTotalPages(response.data.pages);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (!message.isRead) {
      try {
        await api.put(`/messages/${message._id}/read`);
        setMessages(prev => 
          prev.map(msg => 
            msg._id === message._id 
              ? { ...msg, isRead: true }
              : msg
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleAppointmentAction = async (appointmentId, action, reason = '') => {
    try {
      const data = { 
        status: action,
        ...(reason && { rejectionReason: reason })
      };
      
      const response = await api.put(`/appointments/${appointmentId}/status`, data);
      
      if (response.data.success) {
        toast.success(`Appointment ${action} successfully`);
        
        // Update the message to reflect the action taken
        setSelectedMessage(prev => ({
          ...prev,
          appointment: {
            ...prev.appointment,
            status: action
          }
        }));
        
        // Refresh messages
        fetchMessages();
      }
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${action} appointment`;
      toast.error(message);
      console.error(`Error ${action} appointment:`, error);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      const response = await api.post(`/messages/${selectedMessage._id}/reply`, {
        content: replyContent
      });
      
      if (response.data.success) {
        toast.success('Reply sent successfully');
        setShowReplyModal(false);
        setReplyContent('');
        fetchMessages();
      }
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error sending reply:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'appointment_request':
        return <Calendar className="h-4 w-4" />;
      case 'appointment_response':
        return <CheckCircle className="h-4 w-4" />;
      case 'urgent':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Messages List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Messages {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="appointment_request">Appointment Requests</option>
              <option value="appointment_response">Appointment Responses</option>
              <option value="general">General Messages</option>
              <option value="urgent">Urgent Messages</option>
            </select>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {messages.map((message) => (
            <div
              key={message._id}
              onClick={() => handleMessageClick(message)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedMessage?._id === message._id ? 'bg-blue-50 border-blue-200' : ''
              } ${!message.isRead ? 'bg-blue-25' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getMessageTypeIcon(message.messageType)}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                    {!message.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {message.subject}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    From: {message.sender?.firstName} {message.sender?.lastName}
                  </p>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.content}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No messages found
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Message Detail */}
      <div className="flex-1 bg-gray-50">
        {selectedMessage ? (
          <MessageDetail
            message={selectedMessage}
            onAppointmentAction={handleAppointmentAction}
            onReply={() => setShowReplyModal(true)}
            userType={userType}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a message to view details
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <ReplyModal
          message={selectedMessage}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onReply={handleReply}
          onClose={() => {
            setShowReplyModal(false);
            setReplyContent('');
          }}
        />
      )}
    </div>
  );
};

const MessageDetail = ({ message, onAppointmentAction, onReply, userType }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onAppointmentAction(message.appointment._id, 'rejected', rejectionReason);
    setShowRejectionModal(false);
    setRejectionReason('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 bg-white border-b">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {message.subject}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>From: {message.sender?.firstName} {message.sender?.lastName}</span>
              <span>{formatDate(message.createdAt)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                {message.priority}
              </span>
            </div>
          </div>
          
          <button
            onClick={onReply}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Message Content</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
          </div>

          {message.appointment && (
            <AppointmentDetails
              appointment={message.appointment}
              onAppointmentAction={onAppointmentAction}
              onReject={() => setShowRejectionModal(true)}
              userType={userType}
            />
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Appointment
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for rejecting this appointment..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Reject Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AppointmentDetails = ({ appointment, onAppointmentAction, onReject, userType }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Appointment Details</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4" />
            <span>Date & Time</span>
          </div>
          <p className="font-medium">
            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
          </p>
        </div>

        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Clock className="h-4 w-4" />
            <span>Duration</span>
          </div>
          <p className="font-medium">{appointment.duration || 30} minutes</p>
        </div>

        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <User className="h-4 w-4" />
            <span>Reason</span>
          </div>
          <p className="font-medium">{appointment.reason}</p>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">Consultation Fee</div>
          <p className="font-medium">₹{appointment.consultationFee}</p>
        </div>
      </div>

      {userType === 'doctor' && appointment.status === 'pending' && (
        <div className="flex space-x-3 pt-4 border-t">
          <button
            onClick={() => onAppointmentAction(appointment._id, 'confirmed')}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Accept</span>
          </button>
          <button
            onClick={onReject}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );
};

const ReplyModal = ({ message, replyContent, setReplyContent, onReply, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Reply to: {message.subject}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Reply
          </label>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your reply here..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onReply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'text-red-600 bg-red-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'normal': return 'text-blue-600 bg-blue-100';
    case 'low': return 'text-gray-600 bg-gray-100';
    default: return 'text-blue-600 bg-blue-100';
  }
};

export default Messages;
