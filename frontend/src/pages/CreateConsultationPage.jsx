import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';

const schema = yup.object({
  patientId: yup.string().required('Patient is required'),
  medicalCondition: yup.string()
    .required('Medical condition is required')
    .max(200, 'Medical condition cannot exceed 200 characters'),
  symptoms: yup.array().of(
    yup.object({
      symptom: yup.string().required('Symptom description is required'),
      severity: yup.string().oneOf(['mild', 'moderate', 'severe']),
      duration: yup.string()
    })
  ).min(1, 'At least one symptom is required'),
  diagnosis: yup.object({
    primaryDiagnosis: yup.string()
      .required('Primary diagnosis is required')
      .max(300, 'Primary diagnosis cannot exceed 300 characters'),
    secondaryDiagnosis: yup.string().max(300, 'Secondary diagnosis cannot exceed 300 characters'),
    notes: yup.string().max(1000, 'Diagnosis notes cannot exceed 1000 characters')
  }),
  medications: yup.array().of(
    yup.object({
      name: yup.string().required('Medication name is required'),
      dosage: yup.string().required('Dosage is required'),
      frequency: yup.string().required('Frequency is required'),
      duration: yup.string().required('Duration is required'),
      instructions: yup.string()
    })
  ),
  vitals: yup.object({
    bloodPressure: yup.object({
      systolic: yup.number().positive(),
      diastolic: yup.number().positive()
    }),
    heartRate: yup.number().positive(),
    temperature: yup.number().positive(),
    weight: yup.number().positive(),
    height: yup.number().positive()
  }),
  consultationType: yup.string().oneOf(['in-person', 'video-call', 'phone-call']),
  consultationFee: yup.number().min(0, 'Fee cannot be negative'),
  followUpDate: yup.date()
});

const CreateConsultation = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      symptoms: [{ symptom: '', severity: 'mild', duration: '' }],
      medications: [],
      diagnosis: { primaryDiagnosis: '', secondaryDiagnosis: '', notes: '' },
      vitals: { bloodPressure: { systolic: '', diastolic: '' } },
      consultationType: 'in-person'
    }
  });

  const {
    fields: symptomFields,
    append: appendSymptom,
    remove: removeSymptom
  } = useFieldArray({
    control,
    name: 'symptoms'
  });

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication
  } = useFieldArray({
    control,
    name: 'medications'
  });

  // This would typically fetch patients from an appointment or search API
  // For now, we'll assume patients are selected from appointments
  useEffect(() => {
    // You might want to fetch patients from appointments or have a search functionality
    setPatients([]);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clean up empty fields
      const cleanedData = {
        ...data,
        symptoms: data.symptoms.filter(symptom => symptom.symptom.trim()),
        medications: data.medications.filter(med => med.name.trim()),
        vitals: Object.fromEntries(
          Object.entries(data.vitals).filter(([key, value]) => {
            if (key === 'bloodPressure') {
              return value.systolic && value.diastolic;
            }
            return value !== '' && value != null;
          })
        )
      };

      await api.post('/api/consultations', cleanedData);
      setSuccess('Consultation record created successfully!');
      reset();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create consultation record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Create Consultation Record</h1>

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Patient Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Patient Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Patient ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('patientId')}
                placeholder="Enter patient ID"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.patientId && (
                <p className="text-red-400 text-sm mt-1">{errors.patientId.message}</p>
              )}
            </div>
          </div>

          {/* Medical Condition */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Medical Condition</h2>
            <div>
              <textarea
                {...register('medicalCondition')}
                placeholder="Describe the patient's medical condition..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.medicalCondition && (
                <p className="text-red-400 text-sm mt-1">{errors.medicalCondition.message}</p>
              )}
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Symptoms</h2>
            {symptomFields.map((field, index) => (
              <div key={field.id} className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-white/5 rounded-lg">
                <div className="md:col-span-2">
                  <input
                    {...register(`symptoms.${index}.symptom`)}
                    placeholder="Symptom description"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    {...register(`symptoms.${index}.severity`)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <input
                    {...register(`symptoms.${index}.duration`)}
                    placeholder="Duration"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {symptomFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSymptom(index)}
                      className="px-3 py-3 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSymptom({ symptom: '', severity: 'mild', duration: '' })}
              className="mt-2 px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              + Add Symptom
            </button>
          </div>

          {/* Diagnosis */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Diagnosis</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Primary Diagnosis <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('diagnosis.primaryDiagnosis')}
                  placeholder="Primary diagnosis"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.diagnosis?.primaryDiagnosis && (
                  <p className="text-red-400 text-sm mt-1">{errors.diagnosis.primaryDiagnosis.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Secondary Diagnosis
                </label>
                <input
                  {...register('diagnosis.secondaryDiagnosis')}
                  placeholder="Secondary diagnosis (optional)"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Diagnosis Notes
                </label>
                <textarea
                  {...register('diagnosis.notes')}
                  placeholder="Additional notes about the diagnosis..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Medications</h2>
            {medicationFields.map((field, index) => (
              <div key={field.id} className="grid md:grid-cols-5 gap-4 mb-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <input
                    {...register(`medications.${index}.name`)}
                    placeholder="Medication name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    {...register(`medications.${index}.dosage`)}
                    placeholder="Dosage"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    {...register(`medications.${index}.frequency`)}
                    placeholder="Frequency"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    {...register(`medications.${index}.duration`)}
                    placeholder="Duration"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    {...register(`medications.${index}.instructions`)}
                    placeholder="Instructions"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="px-3 py-3 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendMedication({ name: '', dosage: '', frequency: '', duration: '', instructions: '' })}
              className="mt-2 px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              + Add Medication
            </button>
          </div>

          {/* Vitals */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Vitals (Optional)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Blood Pressure</label>
                <div className="flex space-x-2">
                  <input
                    {...register('vitals.bloodPressure.systolic')}
                    placeholder="Systolic"
                    type="number"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-white self-center">/</span>
                  <input
                    {...register('vitals.bloodPressure.diastolic')}
                    placeholder="Diastolic"
                    type="number"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Heart Rate (bpm)</label>
                <input
                  {...register('vitals.heartRate')}
                  type="number"
                  placeholder="Heart rate"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Temperature (°F)</label>
                <input
                  {...register('vitals.temperature')}
                  type="number"
                  step="0.1"
                  placeholder="Temperature"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Weight (lbs)</label>
                <input
                  {...register('vitals.weight')}
                  type="number"
                  placeholder="Weight"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Height (inches)</label>
                <input
                  {...register('vitals.height')}
                  type="number"
                  placeholder="Height"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Consultation Type</label>
                <select
                  {...register('consultationType')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in-person">In-Person</option>
                  <option value="video-call">Video Call</option>
                  <option value="phone-call">Phone Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Consultation Fee ($)</label>
                <input
                  {...register('consultationFee')}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Fee amount"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Follow-up Date</label>
                <input
                  {...register('followUpDate')}
                  type="datetime-local"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 bg-gray-500/20 text-gray-200 rounded-lg hover:bg-gray-500/30 transition-all"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating...' : 'Create Consultation Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConsultation;
