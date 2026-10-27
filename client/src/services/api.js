import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Auth Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillcert_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear local storage
      if (localStorage.getItem('skillcert_token')) {
        localStorage.removeItem('skillcert_token');
        localStorage.removeItem('skillcert_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
