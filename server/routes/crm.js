import express from 'express';
import crmController from '../controllers/crmController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard', crmController.getDashboard);

// Customers
router.get('/customers', crmController.getCustomers);
router.get('/customers/detail/:id', crmController.getCustomerDetail);
router.post('/customers', crmController.addCustomer);
router.put('/customers/:id', crmController.updateCustomer);
router.delete('/customers/:id', crmController.deleteCustomer);

// Membership
router.get('/customers/membership/:level', crmController.getByMembership);

// Top customers
router.get('/customers/top', crmController.getTopCustomers);

export default router;
