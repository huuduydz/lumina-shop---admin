import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// Orders
router.get('/', orderController.getAllOrders);
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);

// Stats
router.get('/stats/revenue', orderController.getRevenueStats);

export default router;
