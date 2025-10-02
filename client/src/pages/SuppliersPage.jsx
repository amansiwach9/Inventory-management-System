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
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/SupplierService.jsx';

const SuppliersPage = () => {
    const { user } = useAuth();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const isAdmin = user?.role === 'ADMIN';

    const fetchSuppliers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllSuppliers();
            setSuppliers(response.data);
        } catch (err) {
            setError('Failed to fetch suppliers. Please ensure the backend server is running and you are logged in.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleCreateClick = () => {
        setEditingSupplier(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };
    
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSupplierToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!supplierToDelete) return;
        try {
            await deleteSupplier(supplierToDelete.id);
            setSnackbar({ open: true, message: 'Supplier deleted successfully!', severity: 'success' });
            fetchSuppliers(); // Refresh the list
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to delete supplier.', severity: 'error' });
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
                <Typography variant="h4" gutterBottom>Suppliers</Typography>
                {isAdmin && (
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleCreateClick}>
                        Create Supplier
                    </Button>
                )}
            </Box>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="suppliers table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Supplier Name</TableCell>
                                <TableCell>Contact Name</TableCell>
                                <TableCell>Contact Email</TableCell>
                                <TableCell>Contact Phone</TableCell>
                                {isAdmin && <TableCell align="center">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {suppliers.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell>{row.contactName}</TableCell>
                                    <TableCell>{row.contactEmail}</TableCell>
                                    <TableCell>{row.contactPhone}</TableCell>
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

            <SupplierFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                supplier={editingSupplier}
                onSuccess={() => {
                    fetchSuppliers();
                    setSnackbar({ 
                        open: true, 
                        message: `Supplier ${editingSupplier ? 'updated' : 'created'} successfully!`, 
                        severity: 'success' 
                    });
                }}
                onError={(err) => setSnackbar({ open: true, message: err, severity: 'error' })}
            />

            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the supplier: <strong>{supplierToDelete?.name}</strong>? This action cannot be undone.
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

// --- Helper Component: Supplier Form Modal ---
const SupplierFormModal = ({ open, onClose, supplier, onSuccess, onError }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || '',
                contactName: supplier.contactName || '',
                contactEmail: supplier.contactEmail || '',
                contactPhone: supplier.contactPhone || '',
            });
        } else {
            setFormData({ name: '', contactName: '', contactEmail: '', contactPhone: '' });
        }
    }, [supplier, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            if (supplier) {
                await updateSupplier(supplier.id, formData);
            } else {
                await createSupplier(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            const message = err.response?.data?.message || `Failed to ${supplier ? 'update' : 'create'} supplier.`;
            onError(message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{supplier ? 'Edit Supplier' : 'Create New Supplier'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                    <TextField name="name" label="Supplier Name" value={formData.name || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField name="contactName" label="Contact Name" value={formData.contactName || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField name="contactEmail" label="Contact Email" type="email" value={formData.contactEmail || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField name="contactPhone" label="Contact Phone" value={formData.contactPhone || ''} onChange={handleChange} fullWidth required margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{supplier ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default SuppliersPage;

