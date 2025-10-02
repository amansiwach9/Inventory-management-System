import React, { useState, useEffect, createContext, useMemo } from 'react';
import authService from '../api/AuthService.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const loginAction = async (credentials) => {
        const response = await authService.login(credentials);
        if (response.data && response.data.token) {
            const { token, ...userData } = response.data;
            setToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return response;
    };

    const logoutAction = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = useMemo(() => ({
        token, user, isAuthenticated, loading, loginAction, logoutAction
    }), [token, user, isAuthenticated, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

