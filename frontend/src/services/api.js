/**
 * API SERVICE (Axios Client Setup)
 * This file creates an instance of Axios to communicate with our Express backend.
 * It sets the standard base URL and configures "request interceptors"
 * to automatically append the admin's JWT token to every request
 * if the admin is logged in. This prevents having to write auth headers manually every time!
 */

import axios from 'axios';

// Create the configured Axios instance
const api = axios.create({
  // Point to our Express backend port (5000) prefix
  baseURL: 'http://localhost:5000/api',
  // Standard JSON communications
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * REQUEST INTERCEPTOR:
 * Every time Axios prepares to send a request (e.g. adding a car, loading orders),
 * this function runs FIRST. It checks if an admin JWT token is in localStorage.
 * If found, it injects it into the HTTP "Authorization" header!
 */
api.interceptors.request.use(
  (config) => {
    // 1. Retrieve the JWT admin token from localStorage
    const token = localStorage.getItem('timgad_admin_token');
    
    // 2. If the token exists, attach it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Return standard promise error
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR:
 * Every time the backend answers, this runs BEFORE the page receives it.
 * If the token has expired, or we get a 401 Unauthorized, we can clean up
 * the session or display a notification globally.
 */
api.interceptors.response.use(
  (response) => {
    // Simply pass along successful responses
    return response;
  },
  (error) => {
    // Parse backend response error details
    const backendMessage = error.response?.data?.message || 'A network error occurred. Please try again.';
    console.error('API Request Failed:', backendMessage, error);
    
    // If the backend returns 401 Unauthorized, it means the token expired or is invalid
    if (error.response?.status === 401) {
      // Clear out the stale token from memory so they can log in again
      localStorage.removeItem('timgad_admin_token');
      localStorage.removeItem('timgad_admin_email');
    }
    
    // Pass along the error message so our components can catch it in try-catch blocks
    return Promise.reject(error);
  }
);

export default api;
