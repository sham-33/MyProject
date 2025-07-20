import React, { useState } from 'react';
import { Calendar, Search, Filter } from 'lucide-react';
import DoctorsList from '../components/doctor/DoctorsList';
import AppointmentBooking from '../components/appointment/AppointmentBooking';

const ExploreDoctorsPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (appointment) => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
    // You can add additional success handling here, like redirecting to appointments page
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Find & Book Doctors</h1>
          </div>
          <p className="text-lg text-gray-600">
            Search for qualified doctors in your area and book appointments online
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Search Doctors</h3>
                <p className="text-sm text-gray-500">Find doctors by specialization, name, or location</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Book Instantly</h3>
                <p className="text-sm text-gray-500">Schedule appointments with available time slots</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
                <p className="text-sm text-gray-500">Narrow down by specialty, fees, and availability</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <DoctorsList onSelectDoctor={handleSelectDoctor} />

        {/* Appointment Booking Modal */}
        <AppointmentBooking
          doctor={selectedDoctor}
          isOpen={showBookingModal}
          onClose={handleCloseBooking}
          onSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
};

export default ExploreDoctorsPage;
