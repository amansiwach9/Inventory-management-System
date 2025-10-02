import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { protect, permit } from '../middleware/authMiddleware.js';

const categoryRouter = express.Router();

// ADMINS can create, update, delete categories
categoryRouter.route('/')
    .post(protect, permit('ADMIN'), categoryController.createCategory)
    .get(protect, categoryController.getAllCategories);

categoryRouter.route('/:id')
    .get(protect, categoryController.getCategoryById)
    .put(protect, permit('ADMIN'), categoryController.updateCategory)
    .delete(protect, permit('ADMIN'), categoryController.deleteCategory);

export default categoryRouter;