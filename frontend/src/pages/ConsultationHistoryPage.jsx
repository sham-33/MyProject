import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ConsultationHistory = () => {
  const [consultations, setConsultations] = useState([]);
  const [latestConsultation, setLatestConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('latest');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0
  });

  const fetchLatestConsultation = async () => {
    try {
      const response = await api.get('/api/patients/consultations/latest');
      setLatestConsultation(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching latest consultation:', error);
      }
    }
  };

  const fetchConsultations = async (page = 1) => {
    try {
      const response = await api.get(`/api/patients/consultations?page=${page}&limit=${pagination.limit}`);
      setConsultations(response.data.data);
      setPagination({
        ...pagination,
        page: response.data.pagination.page,
        total: response.data.total,
        pages: response.data.pagination.pages
      });
    } catch (error) {
      setError('Failed to fetch consultation history');
      console.error('Error fetching consultations:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchLatestConsultation(),
        fetchConsultations()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ConsultationCard = ({ consultation }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Consultation with Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
          </h3>
          <p className="text-blue-200">{consultation.doctor.specialization}</p>
          <p className="text-gray-300 text-sm">{formatDate(consultation.createdAt)}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            consultation.consultationType === 'in-person' ? 'bg-blue-100 text-blue-800' :
            consultation.consultationType === 'video-call' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {consultation.consultationType.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-white mb-3">Medical Condition</h4>
          <p className="text-gray-200 mb-4">{consultation.medicalCondition}</p>

          <h4 className="font-semibold text-white mb-3">Symptoms</h4>
          <div className="space-y-2 mb-4">
            {consultation.symptoms.map((symptom, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <span className="text-gray-200">{symptom.symptom}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                    {symptom.severity}
                  </span>
                  {symptom.duration && (
                    <span className="text-gray-400 text-sm">({symptom.duration})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Diagnosis</h4>
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <p className="text-white font-medium mb-2">Primary: {consultation.diagnosis.primaryDiagnosis}</p>
            {consultation.diagnosis.secondaryDiagnosis && (
              <p className="text-gray-200 mb-2">Secondary: {consultation.diagnosis.secondaryDiagnosis}</p>
            )}
            {consultation.diagnosis.notes && (
              <p className="text-gray-300 text-sm">{consultation.diagnosis.notes}</p>
            )}
          </div>

          {consultation.medications && consultation.medications.length > 0 && (
            <>
              <h4 className="font-semibold text-white mb-3">Medications</h4>
              <div className="space-y-3">
                {consultation.medications.map((medication, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-white">{medication.name}</h5>
                      <span className="text-blue-200 text-sm">{medication.dosage}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">
                      Frequency: {medication.frequency} • Duration: {medication.duration}
                    </p>
                    {medication.instructions && (
                      <p className="text-gray-400 text-xs">{medication.instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {consultation.followUpDate && (
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
              <p className="text-blue-200 text-sm">
                <span className="font-medium">Follow-up Date:</span> {formatDate(consultation.followUpDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      {consultation.vitals && Object.keys(consultation.vitals).length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="font-semibold text-white mb-3">Vitals</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {consultation.vitals.bloodPressure && (
              <div className="text-center">
                <p className="text-gray-400 text-xs">Blood Pressure</p>
                <p className="text-white font-medium">
                  {consultation.vitals.bloodPressure.systolic}/{consultation.vitals.bloodPressure.diastolic}
                </p>
              </div>
            )}
            {consultation.vitals.heartRate && (
              <div className="text-center">
                <p className="text-gray-400 text-xs">Heart Rate</p>
                <p className="text-white font-medium">{consultation.vitals.heartRate} bpm</p>
              </div>
            )}
            {consultation.vitals.temperature && (
              <div className="text-center">
                <p className="text-gray-400 text-xs">Temperature</p>
                <p className="text-white font-medium">{consultation.vitals.temperature}°F</p>
              </div>
            )}
            {consultation.vitals.weight && (
              <div className="text-center">
                <p className="text-gray-400 text-xs">Weight</p>
                <p className="text-white font-medium">{consultation.vitals.weight} lbs</p>
              </div>
            )}
            {consultation.vitals.height && (
              <div className="text-center">
                <p className="text-gray-400 text-xs">Height</p>
                <p className="text-white font-medium">{consultation.vitals.height} in</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading consultation history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Consultation History</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'latest'
                ? 'bg-white text-blue-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Latest Consultation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-blue-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Full History
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Latest Consultation Tab */}
        {activeTab === 'latest' && (
          <div>
            {latestConsultation ? (
              <ConsultationCard consultation={latestConsultation} />
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
                <p className="text-gray-300 text-lg">No consultation records found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Your consultation history will appear here after your first visit
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            {consultations.length > 0 ? (
              <>
                {consultations.map((consultation) => (
                  <ConsultationCard key={consultation._id} consultation={consultation} />
                ))}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                      onClick={() => fetchConsultations(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                    >
                      Previous
                    </button>
                    <span className="text-white">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => fetchConsultations(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
                <p className="text-gray-300 text-lg">No consultation records found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Your consultation history will appear here after your first visit
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationHistory;
