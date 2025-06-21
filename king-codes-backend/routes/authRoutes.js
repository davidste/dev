
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Example protected route to get current user info

// Add routes for forgot-password, reset-password, verify-otp, etc. later

module.exports = router;
