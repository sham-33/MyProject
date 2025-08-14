import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import toast from 'react-hot-toast';

const appointmentSchema = yup.object({
  appointmentDate: yup
    .date()
    .required('Appointment date is required')
    .min(new Date(), 'Appointment date cannot be in the past'),
  appointmentTime: yup
    .string()
    .required('Appointment time is required'),
  reason: yup
    .string()
    .required('Reason for appointment is required')
    .max(500, 'Reason cannot be more than 500 characters'),
  symptoms: yup
    .string()
    .max(1000, 'Symptoms description cannot be more than 1000 characters'),
  duration: yup
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(120, 'Duration cannot exceed 120 minutes'),
  isUrgent: yup.boolean()
});

const AppointmentBooking = ({ doctor, isOpen, onClose, onSuccess }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      duration: 30,
      isUrgent: false
    }
  });

  const watchedDate = watch('appointmentDate');

  useEffect(() => {
    if (watchedDate && doctor) {
      fetchAvailableSlots(watchedDate);
      setSelectedDate(watchedDate);
    }
  }, [watchedDate, doctor]);

  useEffect(() => {
    if (isOpen) {
      reset();
      setAvailableSlots([]);
      setSelectedDate('');
    }
  }, [isOpen, reset]);

  const fetchAvailableSlots = async (date) => {
    try {
      setSlotsLoading(true);
      const response = await api.get(
        `/appointments/doctor/${doctor._id}/availability?date=${date}`
      );
      
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
      }
    } catch (error) {
      toast.error('Failed to fetch available slots');
      console.error('Error fetching slots:', error);
    } finally {
      setSlotsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const appointmentData = {
        doctorId: doctor._id,
        date: data.appointmentDate,
        time: data.appointmentTime,
        reason: data.reason
      };

      const response = await api.post('/appointments/book', appointmentData);
      
      if (response.data.success) {
        toast.success('Appointment request sent successfully!');
        onSuccess && onSuccess(response.data.data);
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Book Appointment with Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Doctor Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {doctor.specialization.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">{doctor.hospital}</p>
                <p className="text-sm font-medium text-green-600">
                  Consultation Fee: ₹{doctor.consultationFee}
                </p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Appointment Date
            </label>
            <input
              type="date"
              min={getMinDate()}
              max={getMaxDate()}
              {...register('appointmentDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
            )}
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Available Time Slots
              </label>
              
              {slotsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <label key={slot} className="relative">
                      <input
                        type="radio"
                        value={slot}
                        {...register('appointmentTime')}
                        className="sr-only"
                      />
                      <div className="cursor-pointer p-2 text-center text-sm border border-gray-300 rounded-md hover:bg-blue-50 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600">
                        {slot}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No available slots for this date
                </div>
              )}
              
              {errors.appointmentTime && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
              )}
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Duration (minutes)
            </label>
            <select
              {...register('duration')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </select>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Reason for Appointment
            </label>
            <textarea
              {...register('reason')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe the reason for your appointment..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          {/* Symptoms */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Symptoms (Optional)
            </label>
            <textarea
              {...register('symptoms')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe any symptoms you're experiencing..."
            />
            {errors.symptoms && (
              <p className="mt-1 text-sm text-red-600">{errors.symptoms.message}</p>
            )}
          </div>

          {/* Urgent */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('isUrgent')}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div>
              <label className="text-sm font-medium text-gray-700">
                This is an urgent appointment
              </label>
              <p className="text-xs text-gray-500">
                Check this if you need immediate medical attention
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDate || availableSlots.length === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
