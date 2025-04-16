const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/protect');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Protected profile route
router.get('/profile', protect, authController.getProfile);

module.exports = router;
