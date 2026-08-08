const express = require('express');
const { register, login } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Rutas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;