import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, DollarSign, Stethoscope, Award, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DoctorsList = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    minFee: '',
    maxFee: '',
    availability: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const specializations = [
    'cardiology', 'dermatology', 'endocrinology', 'gastroenterology',
    'neurology', 'oncology', 'orthopedics', 'pediatrics', 'psychiatry',
    'pulmonology', 'radiology', 'surgery', 'urology', 'general_medicine',
    'emergency_medicine', 'anesthesiology', 'pathology', 'ophthalmology',
    'otolaryngology'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, filters, searchTerm]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 9,
        search: searchTerm,
        ...filters
      });

      const response = await api.get(`/doctors?${queryParams}`);
      if (response.data.success) {
        setDoctors(response.data.data);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      specialization: '',
      minFee: '',
      maxFee: '',
      availability: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const formatSpecialization = (spec) => {
    return spec.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding the best doctors for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Find Your Perfect Doctor</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <select
            value={filters.specialization}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {formatSpecialization(spec)}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Fee"
              value={filters.minFee}
              onChange={(e) => handleFilterChange('minFee', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input
              type="number"
              placeholder="Max Fee"
              value={filters.maxFee}
              onChange={(e) => handleFilterChange('maxFee', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            onSelectDoctor={onSelectDoctor}
          />
        ))}
      </div>

      {doctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
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
    </div>
  );
};

const DoctorCard = ({ doctor, onSelectDoctor }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 card-hover">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-sm font-semibold text-blue-600">
                {formatSpecialization(doctor.specialization)}
              </p>
            </div>
          </div>
          {doctor.isVerified && (
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-100 text-green-800">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="h-4 w-4 mr-3 text-gray-400" />
            <span className="font-medium">{doctor.hospital}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <DollarSign className="h-4 w-4 mr-3 text-gray-400" />
            <span className="font-medium">₹{doctor.consultationFee} consultation</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="h-4 w-4 mr-3 text-gray-400" />
            <span className="font-medium">{doctor.experience} years experience</span>
          </div>
        </div>

        {doctor.biography && (
          <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
            {doctor.biography}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">4.0</span>
            <span className="text-xs text-gray-500">(25+ reviews)</span>
          </div>
          
          <button
            onClick={() => onSelectDoctor(doctor)}
            className="btn-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2"
          >
            <span>Book Now</span>
            <Users className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const formatSpecialization = (spec) => {
  return spec.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default DoctorsList;
