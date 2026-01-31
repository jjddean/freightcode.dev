import axios from 'axios';

// Create a configured axios instance for your backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  async (config) => {
    // If you are using Clerk, you can get the token here
    // const token = await window.Clerk?.session?.getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (like 401 Unauthorized)
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      console.warn('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default api;
