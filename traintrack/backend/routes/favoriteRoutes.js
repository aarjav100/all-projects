const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All favorite routes are protected

router.get('/', getFavorites);
router.post('/:trainId', addFavorite);
router.delete('/:trainId', removeFavorite);

module.exports = router;
