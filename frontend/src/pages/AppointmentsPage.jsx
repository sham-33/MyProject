import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  DollarSign, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
  const { user, userType } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const endpoint = userType === 'patient' ? '/appointments/patient' : '/appointments/doctor';
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { status: filter })
      });

      const response = await api.get(`${endpoint}?${queryParams}`);
      if (response.data.success) {
        setAppointments(response.data.data);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId, reason = '') => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`, {
        cancellationReason: reason
      });
      
      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
        setShowDetailModal(false);
      }
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              </div>
              <p className="text-lg text-gray-600">
                {userType === 'patient' 
                  ? 'View and manage your scheduled appointments' 
                  : 'Manage your patient appointments'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              userType={userType}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailModal(true);
              }}
              onCancel={handleCancelAppointment}
            />
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">
              {userType === 'patient' 
                ? 'Book your first appointment with a doctor' 
                : 'No appointments scheduled yet'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Appointment Detail Modal */}
        {showDetailModal && selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            userType={userType}
            onClose={() => setShowDetailModal(false)}
            onCancel={handleCancelAppointment}
          />
        )}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment, userType, onViewDetails, onCancel }) => {
  const otherParty = userType === 'patient' ? appointment.doctor : appointment.patient;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {userType === 'patient' 
                  ? `Dr. ${otherParty.firstName} ${otherParty.lastName}`
                  : `${otherParty.firstName} ${otherParty.lastName}`
                }
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusIcon(appointment.status)}
                <span className="ml-1 capitalize">{appointment.status}</span>
              </span>
            </div>
            
            {userType === 'patient' && appointment.doctor.specialization && (
              <p className="text-sm text-blue-600 font-medium capitalize mb-2">
                {appointment.doctor.specialization.replace('_', ' ')}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTime(appointment.appointmentTime)} ({appointment.duration || 30} min)</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>₹{appointment.consultationFee}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Reason:</p>
          <p className="text-sm text-gray-900">{appointment.reason}</p>
        </div>

        {userType === 'patient' && appointment.doctor.hospital && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{appointment.doctor.hospital}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-3">
            {appointment.rejectionReason && (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                Rejected: {appointment.rejectionReason}
              </span>
            )}
            {appointment.cancellationReason && (
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                Cancelled: {appointment.cancellationReason}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onViewDetails(appointment)}
              className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </button>
            
            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <button
                onClick={() => onCancel(appointment._id)}
                className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentDetailModal = ({ appointment, userType, onClose, onCancel }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  const handleCancel = () => {
    onCancel(appointment._id, cancellationReason);
    setShowCancelForm(false);
    setCancellationReason('');
  };

  const otherParty = userType === 'patient' ? appointment.doctor : appointment.patient;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusIcon(appointment.status)}
              <span className="ml-2 capitalize">{appointment.status}</span>
            </span>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                {userType === 'patient' ? 'Doctor Information' : 'Patient Information'}
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name: </span>
                  {userType === 'patient' 
                    ? `Dr. ${otherParty.firstName} ${otherParty.lastName}`
                    : `${otherParty.firstName} ${otherParty.lastName}`
                  }
                </p>
                {userType === 'patient' && otherParty.specialization && (
                  <p className="text-sm">
                    <span className="font-medium">Specialization: </span>
                    <span className="capitalize">{otherParty.specialization.replace('_', ' ')}</span>
                  </p>
                )}
                {userType === 'patient' && otherParty.hospital && (
                  <p className="text-sm">
                    <span className="font-medium">Hospital: </span>
                    {otherParty.hospital}
                  </p>
                )}
                {userType === 'doctor' && (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Email: </span>
                      {otherParty.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone: </span>
                      {otherParty.phone}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Appointment Details</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Date: </span>
                  {formatDate(appointment.appointmentDate)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time: </span>
                  {formatTime(appointment.appointmentTime)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Duration: </span>
                  {appointment.duration || 30} minutes
                </p>
                <p className="text-sm">
                  <span className="font-medium">Fee: </span>
                  ₹{appointment.consultationFee}
                </p>
              </div>
            </div>
          </div>

          {/* Reason & Symptoms */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Reason for Visit</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{appointment.reason}</p>
          </div>

          {appointment.symptoms && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Symptoms</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{appointment.symptoms}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Doctor's Notes</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{appointment.notes}</p>
            </div>
          )}

          {/* Rejection/Cancellation Reason */}
          {appointment.rejectionReason && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Rejection Reason</h3>
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded">{appointment.rejectionReason}</p>
            </div>
          )}

          {appointment.cancellationReason && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cancellation Reason</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{appointment.cancellationReason}</p>
            </div>
          )}

          {/* Cancel Form */}
          {showCancelForm && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Cancel Appointment</h3>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for cancellation (optional)"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            {!showCancelForm && (appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <button
                onClick={() => setShowCancelForm(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                Cancel Appointment
              </button>
            )}
            
            {showCancelForm ? (
              <>
                <button
                  onClick={() => {
                    setShowCancelForm(false);
                    setCancellationReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Confirm Cancellation
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'confirmed': return 'text-green-600 bg-green-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'cancelled': return 'text-gray-600 bg-gray-100';
    case 'completed': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmed': return <CheckCircle className="h-4 w-4" />;
    case 'rejected': return <XCircle className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
    case 'pending': return <Clock className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (timeString) => {
  return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export default AppointmentsPage;
