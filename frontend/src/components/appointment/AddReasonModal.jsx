import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AddReasonModal = ({ appointment, isOpen, onClose, onSuccess }) => {
  const [newReason, setNewReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReason.trim()) {
      toast.error('Please enter a reason');
      return;
    }

    setLoading(true);
    try {
      // Instead of updating the appointment, we'll book a new "appointment" which will update the existing one
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          doctorId: appointment.doctor._id,
          date: appointment.date,
          time: appointment.time,
          reason: newReason.trim() 
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('New reason added successfully!');
        onSuccess && onSuccess();
        onClose();
        setNewReason('');
      } else {
        toast.error(data.message || 'Failed to add reason');
      }
    } catch (error) {
      console.error('Error adding reason:', error);
      toast.error('Failed to add reason');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Consultation Reason
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment with Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </label>
            <p className="text-xs text-gray-500 mb-3">
              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Reason for Visit <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Please describe your new reason for this appointment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {newReason.length}/500 characters
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !newReason.trim()}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reason
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReasonModal;
