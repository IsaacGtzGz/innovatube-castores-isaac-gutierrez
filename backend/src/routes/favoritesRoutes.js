const express = require('express');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoritesController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/:videoId', removeFavorite);

module.exports = router;