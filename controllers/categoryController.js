import categoryService from '../services/categoryService.js';
import asyncHandler from 'express-async-handler';

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.findAll();
    res.status(200).json(categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.update(req.params.id, req.body);
    res.status(200).json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.remove(req.params.id);
    res.status(204).send();
});

export default { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
