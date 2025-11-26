import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { isAuthenticated, setToken } from './auth';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: { headers: { Authorization: string; }; }) => {
    // Add auth token to headers if available
    const token = localStorage.getItem('token');
    if (token && isAuthenticated()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful response
    return response;
  },
  (error: AxiosError) => {
    // Handle errors
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        setToken(null);
        // Redirect to login page
        window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access denied');
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error('Resource not found');
      }

      // Handle 500 Server Error
      if (status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received:', error.request);
    } else {
      // Error in request setup
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
