
var express = require('express');
var router = express.Router();
const productscontroller = require("../controllers/products.controller");

/* Routes for products */
router.get('/', productscontroller.getAll);
router.get('/:id', productscontroller.getById);
router.post('/', productscontroller.insert);
router.put('/:id', productscontroller.update);
router.delete('/:id', productscontroller.delete);

module.exports = router;
