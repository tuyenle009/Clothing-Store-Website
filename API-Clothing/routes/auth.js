const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route đăng nhập
router.post('/login', authController.login);

// Route đăng ký
router.post('/register', authController.register);

// Handle GET request to /register
router.get('/register', (req, res) => {
    res.status(405).json({ 
        message: 'Method not allowed. Please use POST method for registration.',
        endpoints: {
            register: 'POST /auth/register',
            login: 'POST /auth/login'
        }
    });
});

module.exports = router;
