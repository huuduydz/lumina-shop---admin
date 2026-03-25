import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/seed', productController.seedProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/transactions', productController.getTransactions);
router.post('/:id/stock', productController.updateStock);

export default router;
