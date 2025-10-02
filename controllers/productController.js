import productService from '../services/productService.js';
import asyncHandler from 'express-async-handler';

const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.create(req.body);
    res.status(201).json(product);
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.findAll();
    res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.update(req.params.id, req.body);
    res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
    await productService.remove(req.params.id);
    res.status(204).send();
});

export default { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };