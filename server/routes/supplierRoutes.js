import express from 'express';
import supplierController from '../controllers/supplierController.js';
import { protect, permit } from '../middleware/authMiddleware.js';

const supplierRouter = express.Router();

// ADMINS can do everything
supplierRouter.route('/')
    .post(protect, permit('ADMIN'), supplierController.createSupplier)
    .get(protect, permit('ADMIN'), supplierController.getAllSuppliers);

supplierRouter.route('/:id')
    .get(protect, permit('ADMIN'), supplierController.getSupplierById)
    .put(protect, permit('ADMIN'), supplierController.updateSupplier)
    .delete(protect, permit('ADMIN'), supplierController.deleteSupplier);


export default supplierRouter;