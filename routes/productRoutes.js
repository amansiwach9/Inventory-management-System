import express from 'express';
import productController from '../controllers/productController.js';
import { protect, permit } from '../middleware/authMiddleware.js';

const productRouter = express.Router();

productRouter.route('/')
    .post(protect, permit('ADMIN'), productController.createProduct)
    .get(protect, productController.getAllProducts);

productRouter.route('/:id')
    .get(protect, productController.getProductById)
    .put(protect, permit('ADMIN'), productController.updateProduct)
    .delete(protect, permit('ADMIN'), productController.deleteProduct);

export default productRouter;