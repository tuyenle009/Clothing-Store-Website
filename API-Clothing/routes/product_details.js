const express = require('express');
const router = express.Router();
const productDetailsController = require("../controllers/product_details.controller");

/* Routes for product_details */
router.get('/', productDetailsController.getAll);
router.get('/:id', productDetailsController.getById);
router.get('/product/:productId', productDetailsController.getByProductId);
router.post('/', productDetailsController.insert);
router.put('/:id', productDetailsController.update);
router.delete('/:id', productDetailsController.delete);

module.exports = router;
