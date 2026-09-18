import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nuzio_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      // Token is invalid or expired
      const isAuthPage = window.location.pathname.startsWith('/login');
      if (!isAuthPage) {
        localStorage.removeItem('nuzio_token');
        localStorage.removeItem('nuzio_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
