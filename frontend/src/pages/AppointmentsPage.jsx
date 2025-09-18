import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Stethoscope, Plus, MessageCircle } from 'lucide-react';
import AddReasonModal from '../components/appointment/AddReasonModal';

const AppointmentsPage = () => {
  const { userType } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddReasonModal, setShowAddReasonModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    if (userType === 'patient') {
      fetchDoctors();
    }
  }, [userType]);
  const BASE_URL = 'https://myproject-7fc9.onrender.com/api/appointments';
  // const BASE_URL = 'http://localhost:3333/api/appointments';


 const fetchAppointments = async () => {
  try {
    const endpoint = userType === 'patient' 
      ? `${BASE_URL}/patient` 
      : `${BASE_URL}/doctor`;

    const response = await fetch(endpoint, {
        headers: {
    "Content-Type": "application/json"
  },
      credentials: 'include'
    });
    const data = await response.json();
    if (data.success) {
      setAppointments(data.appointments);
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

const fetchDoctors = async () => {
  try {
    const response = await fetch(`${BASE_URL}/doctors`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (data.success) {
      setDoctors(data.doctors);
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};



const handleCreateAppointment = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason
      })
    });

    const data = await response.json();
    if (data.success) {
      alert('Appointment created successfully!');
      setShowCreateForm(false);
      setFormData({ doctorId: '', date: '', time: '', reason: '' });
      fetchAppointments();
    } else {
      alert(data.message || 'Failed to create appointment');
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    alert('Failed to create appointment');
  } finally {
    setLoading(false);
  }
};

const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await fetch(`${BASE_URL}/${appointmentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    if (data.success) {
      fetchAppointments();
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddReason = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAddReasonModal(true);
  };

  const handleAddReasonSuccess = () => {
    fetchAppointments();
    setShowAddReasonModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-blue-600" />
              Appointments
            </h1>
            {userType === 'patient' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </button>
            )}
          </div>
        </div>

        {/* Create Appointment Form */}
        {showCreateForm && userType === 'patient' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Doctor
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time...</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  placeholder="Please describe the reason for your visit..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {userType === 'patient' ? 'Your Appointments' : 'Patient Appointments'}
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          {userType === 'patient' ? (
                            <Stethoscope className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <User className="h-5 w-5 text-blue-600 mr-2" />
                          )}
                          <span className="font-semibold">
                            {userType === 'patient'
                              ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                              : `${appointment.patient.firstName} ${appointment.patient.lastName}`
                            }
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      {userType === 'patient' && (
                        <p className="text-gray-600 text-sm mb-2">
                          Specialization: {appointment.doctor.specialization}
                        </p>
                      )}

                      {/* Current and Previous Reasons */}
                      <div className="text-gray-700 text-sm mb-2">
                        {(() => {
                          // Handle different data structures
                          let currentReason = '';
                          let previousReasons = [];

                          if (appointment.reasons && appointment.reasons.length > 0) {
                            // New structure with reasons array - latest is current, rest are previous
                            currentReason = appointment.reasons[appointment.reasons.length - 1].text;
                            previousReasons = appointment.reasons.slice(0, -1).map(r => r.text);
                          } else if (appointment.currentReason && appointment.previousConsultations) {
                            // From backend formatted response
                            currentReason = appointment.currentReason.text;
                            previousReasons = appointment.previousConsultations.map(r => r.text);
                          } else if (appointment.reason) {
                            // Legacy structure with single reason
                            currentReason = appointment.reason;
                          }

                          return (
                            <div>
                              <div><strong>Reason:</strong> {currentReason || 'No reason provided'}</div>
                              {previousReasons.length > 0 && (
                                <div className="mt-1">
                                  <strong>Previous Reasons:</strong> {previousReasons.join(', ')}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>


                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(appointment.date).toLocaleDateString()}
                        <Clock className="h-4 w-4 ml-4 mr-1" />
                        {appointment.time}
                      </div>
                    </div>

                    {/* Doctor Actions */}
                    {userType === 'doctor' && appointment.status === 'scheduled' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Patient Actions */}
                    {userType === 'patient' && appointment.status === 'scheduled' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddReason(appointment)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Add Reason
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Reason Modal */}
      <AddReasonModal
        appointment={selectedAppointment}
        isOpen={showAddReasonModal}
        onClose={() => {
          setShowAddReasonModal(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleAddReasonSuccess}
      />
    </div>
  );
};

export default AppointmentsPage;
