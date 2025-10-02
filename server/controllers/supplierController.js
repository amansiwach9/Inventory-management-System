import supplierService from '../services/supplierService.js';
import asyncHandler from 'express-async-handler';

const createSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.create(req.body);
    res.status(201).json(supplier);
});

const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await supplierService.findAll();
    res.status(200).json(suppliers);
});

const getSupplierById = asyncHandler(async (req, res) => {
    const supplier = await supplierService.findById(req.params.id);
    if (!supplier) {
        res.status(404);
        throw new Error('Supplier not found');
    }
    res.status(200).json(supplier);
});

const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.update(req.params.id, req.body);
    res.status(200).json(supplier);
});

const deleteSupplier = asyncHandler(async (req, res) => {
    await supplierService.remove(req.params.id);
    res.status(204).send();
});


export default { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };