var express = require('express');
var router = express.Router();
const statisticscontroller = require("../controllers/statistics.controller");

/* Routes for statistics */
router.get('/', statisticscontroller.getAll);
router.get('/dashboard', statisticscontroller.getDashboardStats);
router.get('/monthly-revenue', statisticscontroller.getMonthlyRevenue);
router.get('/:id', statisticscontroller.getById);
router.post('/', statisticscontroller.insert);
router.put('/:id', statisticscontroller.update);
router.delete('/:id', statisticscontroller.delete);

module.exports = router;
