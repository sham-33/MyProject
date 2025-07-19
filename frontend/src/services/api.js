import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Patient API endpoints
export const patientAPI = {
  register: (data) => api.post('/patients/register', data),
  login: (data) => api.post('/patients/login', data),
  getProfile: () => api.get('/patients/me'),
  updateProfile: (data) => api.put('/patients/updatedetails', data),
  updatePassword: (data) => api.put('/patients/updatepassword', data),
  forgotPassword: (data) => api.post('/patients/forgotpassword', data),
  resetPassword: (token, data) => api.put(`/patients/resetpassword/${token}`, data),
  logout: () => api.get('/patients/logout'),
};

// Doctor API endpoints
export const doctorAPI = {
  register: (data) => api.post('/doctors/register', data),
  login: (data) => api.post('/doctors/login', data),
  getProfile: () => api.get('/doctors/me'),
  updateProfile: (data) => api.put('/doctors/updatedetails', data),
  updatePassword: (data) => api.put('/doctors/updatepassword', data),
  forgotPassword: (data) => api.post('/doctors/forgotpassword', data),
  resetPassword: (token, data) => api.put(`/doctors/resetpassword/${token}`, data),
  getAllDoctors: (params) => api.get('/doctors', { params }),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  logout: () => api.get('/doctors/logout'),
};

export default api;
