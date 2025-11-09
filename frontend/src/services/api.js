import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Employee API
export const employeeAPI = {
  getAll: (params) => api.get('/employees/', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees/', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getStats: () => api.get('/employees/stats/dashboard'),
};

// Prediction API
export const predictionAPI = {
  predictEmployee: (id) => api.post(`/predict/employee/${id}`),
  predictBatch: () => api.post('/predict/batch'),
};

// Feedback API
export const feedbackAPI = {
  create: (data) => api.post('/feedback/', data),
  getByEmployee: (employeeId) => api.get(`/feedback/employee/${employeeId}`),
  getById: (id) => api.get(`/feedback/${id}`),
};

export default api;