import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL||'http://localhost:5000/api/v1';

// Create a centralized axios instance
const apiClient = axios.create({
    baseURL: API_URL,
});

// Use an interceptor to automatically attach the JWT token to every request.
// This is the most important part of this file. It means we don't have to
// manually add the token to every single API call.
apiClient.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // If the token exists, add it to the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle any errors during the request phase
        return Promise.reject(error);
    }
);

export default apiClient;

