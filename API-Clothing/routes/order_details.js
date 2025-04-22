var express = require('express');
var router = express.Router();
const order_detailscontroller = require("../controllers/order_details.controller");

/* Routes for order_details */
router.get('/', order_detailscontroller.getAll);
router.get('/:id', order_detailscontroller.getById);
router.get('/order/:orderId', order_detailscontroller.getByOrderId);
router.post('/', order_detailscontroller.insert);
router.put('/:id', order_detailscontroller.update);
router.delete('/:id', order_detailscontroller.delete);

module.exports = router;
