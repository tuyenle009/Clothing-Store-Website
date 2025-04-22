const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// ... existing routes ...

router.get('/count', cartController.getCartCount);

// ... existing code ... 