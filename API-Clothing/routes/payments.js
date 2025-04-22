const express = require('express');
const router = express.Router();
const paymentscontroller = require("../controllers/payments.controller");

// Get all payments
router.get('/', paymentscontroller.getAll);

// Get payment by order_id
router.get('/order/:order_id', paymentscontroller.getByOrderId);

// Get payment by id
router.get('/:id', paymentscontroller.getById);

// Create new payment
router.post('/', paymentscontroller.insert);

// Update payment
router.put('/:id', paymentscontroller.update);

// Delete payment
router.delete('/:id', paymentscontroller.delete);

module.exports = router;
