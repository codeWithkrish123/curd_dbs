const express = require('express');
const router = express.Router();
const { signup, login, getMe, logout, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.put('/change-password', protect, changePassword);

module.exports = router;
