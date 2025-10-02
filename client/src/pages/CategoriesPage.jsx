import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, CircularProgress, Alert, IconButton, Tooltip, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuth } from '../hooks/useAuth.jsx';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../api/CategoryService.jsx';

const CategoriesPage = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const isAdmin = user?.role === 'ADMIN';

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to fetch categories. Please ensure the backend server is running and you are logged in.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreateClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };
    
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.id);
            setSnackbar({ open: true, message: 'Category deleted successfully!', severity: 'success' });
            fetchCategories(); // Refresh the list
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to delete category.', severity: 'error' });
        } finally {
            handleCloseDeleteDialog();
        }
    };
    
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Categories</Typography>
                {isAdmin && (
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleCreateClick}>
                        Create Category
                    </Button>
                )}
            </Box>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="categories table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Category Name</TableCell>
                                <TableCell align="right">Number of Products</TableCell>
                                {isAdmin && <TableCell align="center">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell align="right">{row.products?.length || 0}</TableCell>
                                    {isAdmin && (
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleEditClick(row)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDeleteClick(row)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <CategoryFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                category={editingCategory}
                onSuccess={() => {
                    fetchCategories();
                    setSnackbar({ 
                        open: true, 
                        message: `Category ${editingCategory ? 'updated' : 'created'} successfully!`, 
                        severity: 'success' 
                    });
                }}
                onError={(err) => setSnackbar({ open: true, message: err, severity: 'error' })}
            />

            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the category: <strong>{categoryToDelete?.name}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// --- Helper Component: Category Form Modal ---
const CategoryFormModal = ({ open, onClose, category, onSuccess, onError }) => {
    const [formData, setFormData] = useState({ name: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (category) {
            setFormData({ name: category.name || '' });
        } else {
            setFormData({ name: '' });
        }
    }, [category, open]);

    const handleChange = (e) => {
        setFormData({ name: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            if (category) {
                await updateCategory(category.id, formData);
            } else {
                await createCategory(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            const message = err.response?.data?.message || `Failed to ${category ? 'update' : 'create'} category.`;
            onError(message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                    <TextField 
                        autoFocus
                        name="name" 
                        label="Category Name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        fullWidth 
                        required 
                        margin="dense" 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{category ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CategoriesPage;

