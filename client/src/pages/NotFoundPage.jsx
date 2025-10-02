import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                p: 3,
            }}
        >
            <ReportProblemIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Sorry, the page you are looking for does not exist.
            </Typography>
            <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
            >
                Go Back to Dashboard
            </Button>
        </Box>
    );
};

export default NotFoundPage;
