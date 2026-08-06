const express = require('express');
const { searchVideos } = require('../controllers/youtubeController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas de YouTube protegidas
router.use(verifyToken);
router.get('/search', searchVideos);

module.exports = router;