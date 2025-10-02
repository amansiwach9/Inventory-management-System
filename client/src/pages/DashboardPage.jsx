import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardPage = () => (
    <Box>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography paragraph>
            Welcome to the Inventory Management System. Use the navigation on the left to manage your inventory.
        </Typography>
    </Box>
);

export default DashboardPage;

