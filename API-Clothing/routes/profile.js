// routes/profile.js
var express = require('express');
var router = express.Router();
const userscontroller = require("../controllers/users.controller");
const { verifyToken } = require('../middleware/auth');

// Route để truy cập thông tin người dùng đã xác thực
router.get('/', verifyToken, userscontroller.getProfile);

module.exports = router;
