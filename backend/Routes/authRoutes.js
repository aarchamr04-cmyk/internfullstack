const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// PUT /api/auth/profile  (protected)
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
