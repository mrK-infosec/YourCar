import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Send cookies with cross-origin requests
  timeout: 10000 // 10s timeout to prevent hanging requests
});

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Option to handle token refresh here or redirect to login
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
