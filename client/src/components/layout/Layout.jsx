import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx'; // Corrected import path

// --- Material-UI (MUI) Imports ---
import {
    AppBar, Toolbar, Typography, Button, Box, CssBaseline,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';

// --- MUI Icon Imports ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const { user, logoutAction } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAction();
        navigate('/login');
    };

    // Define all possible navigation items with roles for protected items
    const allNavItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Products', icon: <InventoryIcon />, path: '/products' },
        { text: 'Suppliers', icon: <PeopleIcon />, path: '/suppliers', roles: ['ADMIN'] }, // This link is now admin-only
        { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    ];
    
    // Filter the navigation items based on the user's role
    const visibleNavItems = allNavItems.filter(item => {
        // If an item has no roles specified, it's visible to everyone
        if (!item.roles) {
            return true;
        }
        // Otherwise, check if the user's role is in the item's roles array
        return user && item.roles.includes(user.role);
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Inventory Management
                    </Typography>
                    <Typography sx={{ mr: 2 }}>Welcome, {user?.name || 'Guest'}</Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {/* Render only the visible items */}
                        {visibleNavItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton component={Link} to={item.path}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;

