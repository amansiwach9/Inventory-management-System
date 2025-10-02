import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
    // You can customize your MUI theme here later if you wish
    const theme = createTheme(); 

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <BrowserRouter>
                    <CssBaseline />
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;

