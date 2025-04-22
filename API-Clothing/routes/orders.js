var express = require('express');
var router = express.Router();
const orderscontroller = require("../controllers/orders.controller");

/* Routes for orders */
router.get('/', orderscontroller.getAll);
router.get('/user/:userId', orderscontroller.getByUserId);
router.get('/:id', orderscontroller.getById);
router.post('/', orderscontroller.insert);
router.put('/:id', orderscontroller.update);
router.delete('/:id', orderscontroller.delete);

module.exports = router;
