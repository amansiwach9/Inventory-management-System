import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, Grid, Alert, CircularProgress
} from '@mui/material';
import {useAuth} from '../hooks/useAuth.jsx';

const LoginPage = () => {
    const navigate = useNavigate();
    const { loginAction } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginAction(credentials);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign In</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" onChange={handleChange} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                    <Grid container>
                        <Grid item><Link to="/register">{"Don't have an account? Sign Up"}</Link></Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;

