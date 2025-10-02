import apiClient from './ApiClient.jsx';
const register = (userData) => apiClient.post('/auth/register', userData);
const verifyOtp = (otpData) => apiClient.post('/auth/verify-otp', otpData);
const login = (credentials) => apiClient.post('/auth/login', credentials);

const authService = {
    register,
    verifyOtp,
    login,
};

export default authService;

