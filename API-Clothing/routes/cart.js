var express = require('express');
var router = express.Router();
const cartcontroller = require("../controllers/cart.controller");

/* Routes for cart */
router.get('/', cartcontroller.getAll);
router.get('/count', cartcontroller.getCartCount);
router.get('/:id', cartcontroller.getById);
router.post('/', cartcontroller.insert);
router.put('/:id', cartcontroller.update);
router.delete('/:id', cartcontroller.delete);

module.exports = router;
