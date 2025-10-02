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
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../api/ProductService.jsx';
import { getAllCategories } from '../api/CategoryService.jsx';
import { getAllSuppliers } from '../api/SupplierService.jsx';


const ProductsPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const isAdmin = user?.role === 'ADMIN';

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products. Please ensure the backend server is running and you are logged in.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleCreateClick = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete.id);
            setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
            fetchProducts();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to delete product.', severity: 'error' });
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
                <Typography variant="h4" gutterBottom>Products</Typography>
                {isAdmin && (
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleCreateClick}>
                        Create Product
                    </Button>
                )}
            </Box>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="products table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Supplier</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                {isAdmin && <TableCell align="center">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell>{row.sku}</TableCell>
                                    <TableCell>{row.category?.name || 'N/A'}</TableCell>
                                    <TableCell>{row.supplier?.name || 'N/A'}</TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell align="right">{`₹${row.price.toLocaleString('en-IN')}`}</TableCell>
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

            <ProductFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                product={editingProduct}
                onSuccess={() => {
                    fetchProducts();
                    setSnackbar({ 
                        open: true, 
                        message: `Product ${editingProduct ? 'updated' : 'created'} successfully!`, 
                        severity: 'success' 
                    });
                }}
                onError={(err) => setSnackbar({ open: true, message: err, severity: 'error' })}
            />

            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the product: <strong>{productToDelete?.name}</strong>? This action cannot be undone.
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

const ProductFormModal = ({ open, onClose, product, onSuccess, onError }) => {
    const [formData, setFormData] = useState({});
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                description: product.description || '',
                quantity: product.quantity || 0,
                price: product.price || 0,
                categoryId: product.categoryId || '',
                supplierId: product.supplierId || '',
            });
        } else {
            setFormData({ name: '', sku: '', description: '', quantity: 0, price: 0, categoryId: '', supplierId: '' });
        }
    }, [product, open]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const catResponse = await getAllCategories();
                const supResponse = await getAllSuppliers();
                setCategories(catResponse.data);
                setSuppliers(supResponse.data);
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
            }
        };
        if (open) {
            fetchDropdownData();
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        const dataToSubmit = {
            ...formData,
            quantity: parseInt(formData.quantity, 10),
            price: parseFloat(formData.price),
        };

        try {
            if (product) {
                await updateProduct(product.id, dataToSubmit);
            } else {
                await createProduct(dataToSubmit);
            }
            onSuccess();
            onClose();
        } catch (err) {
            const message = err.response?.data?.message || `Failed to ${product ? 'update' : 'create'} product.`;
            onError(message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{product ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                    <TextField name="name" label="Product Name" value={formData.name || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField name="sku" label="SKU" value={formData.sku || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField name="description" label="Description" value={formData.description || ''} onChange={handleChange} fullWidth multiline rows={3} margin="dense" />
                    <TextField name="quantity" label="Quantity" type="number" value={formData.quantity || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField name="price" label="Price" type="number" value={formData.price || ''} onChange={handleChange} fullWidth required margin="dense" />
                    <TextField
                        name="categoryId"
                        label="Category"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        select
                        SelectProps={{ native: true }}
                        margin="dense"
                    >
                        <option value=""></option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </TextField>
                    <TextField
                        name="supplierId"
                        label="Supplier"
                        value={formData.supplierId || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        select
                        SelectProps={{ native: true }}
                        margin="dense"
                    >
                         <option value=""></option>
                        {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{product ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ProductsPage;

