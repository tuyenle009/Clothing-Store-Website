var express = require('express');
var router = express.Router();
const userscontroller = require("../controllers/users.controller");
const { verifyToken, isAdmin } = require('../middleware/auth');

/* Routes for users - cần quyền admin */
router.get('/', verifyToken, isAdmin, userscontroller.getAll);
router.get('/:id', verifyToken, isAdmin, userscontroller.getById);
router.post('/', verifyToken, isAdmin, userscontroller.insert);
router.put('/:id', verifyToken, isAdmin, userscontroller.update);
router.delete('/:id', verifyToken, isAdmin, userscontroller.delete);
router.put('/:id/change-password', verifyToken, isAdmin, userscontroller.changePassword);

module.exports = router;
