import apiClient from './ApiClient.jsx';

// Fetches all suppliers
export const getAllSuppliers = () => {
    return apiClient.get('/suppliers');
};

// Fetches a single supplier by its ID
export const getSupplierById = (id) => {
    return apiClient.get(`/suppliers/${id}`);
};

// Creates a new supplier
export const createSupplier = (supplierData) => {
    return apiClient.post('/suppliers', supplierData);
};

// Updates an existing supplier
export const updateSupplier = (id, supplierData) => {
    return apiClient.put(`/suppliers/${id}`, supplierData);
};

// Deletes a supplier by its ID
export const deleteSupplier = (id) => {
    return apiClient.delete(`/suppliers/${id}`);
};
