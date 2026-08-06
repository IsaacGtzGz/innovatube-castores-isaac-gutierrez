const express = require('express');
const { register } = require('../controllers/authController');

const router = express.Router();

// Rutas de Autenticación
router.post('/register', register);

module.exports = router;