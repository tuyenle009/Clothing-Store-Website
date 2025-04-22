
var express = require('express');
var router = express.Router();
const categoriescontroller = require("../controllers/categories.controller");

/* Routes for categories */
router.get('/', categoriescontroller.getAll);
router.get('/:id', categoriescontroller.getById);
router.post('/', categoriescontroller.insert);
router.put('/:id', categoriescontroller.update);
router.delete('/:id', categoriescontroller.delete);

module.exports = router;
