import apiClient from './ApiClient.jsx';

// Fetches all categories
export const getAllProducts = () => {
    return apiClient.get('/products');
};

// Fetches a single category by its ID
export const getProductById = (id) => {
    return apiClient.get(`/products/${id}`);
};

// Creates a new category
export const createProduct = (ProductData) => {
    return apiClient.post('/products', ProductData);
};

// Updates an existing category
export const updateProduct = (id, ProductData) => {
    return apiClient.put(`/products/${id}`, ProductData);
};

// Deletes a category by its ID
export const deleteProduct = (id) => {
    return apiClient.delete(`/products/${id}`);
};
