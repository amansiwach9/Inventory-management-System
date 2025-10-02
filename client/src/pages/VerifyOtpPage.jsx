import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, Alert, CircularProgress
} from '@mui/material';
import authService from '../api/AuthService.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginAction } = useAuth(); // We'll use a modified login action to set the context
    
    // Get the email from the state passed during navigation
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If the user lands on this page directly without an email, redirect them
        if (!location.state?.email) {
            setError("No email provided. Please register first.");
            // Optional: redirect to register page after a delay
            // setTimeout(() => navigate('/register'), 3000);
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !otp) {
            setError("Please provide your email and OTP.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await authService.verifyOtp({ email, otp });
            // Manually set the auth context with the data from the verify endpoint
            if (response.data && response.data.token) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                // This is a simplified way to update context. A more robust solution might
                // have a dedicated function in AuthContext for this.
                window.location.href = '/'; // Force a full refresh to re-evaluate AuthContext
            } else {
                 throw new Error("Verification successful, but no token received.");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Verify Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    An OTP has been sent to <strong>{email || 'your email address'}</strong>. Please enter it below.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="6-Digit OTP"
                        name="otp"
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5em' } }}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading || !email}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Verify Account'}
                    </Button>
                     <Box textAlign="center">
                        <Link to="/register" variant="body2">
                            Didn't get an OTP? Go back to Register
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default VerifyOtpPage;

