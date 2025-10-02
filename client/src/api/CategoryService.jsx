import apiClient from './ApiClient.jsx';

// Fetches all categories
export const getAllCategories = () => {
    return apiClient.get('/categories');
};

// Fetches a single category by its ID
export const getCategoryById = (id) => {
    return apiClient.get(`/categories/${id}`);
};

// Creates a new category
export const createCategory = (categoryData) => {
    return apiClient.post('/categories', categoryData);
};

// Updates an existing category
export const updateCategory = (id, categoryData) => {
    return apiClient.put(`/categories/${id}`, categoryData);
};

// Deletes a category by its ID
export const deleteCategory = (id) => {
    return apiClient.delete(`/categories/${id}`);
};
