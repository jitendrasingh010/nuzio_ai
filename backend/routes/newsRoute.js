const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');

// Personalized News feed (Protected)
router.get('/personalized', authMiddleware, (req, res) => newsController.getPersonalizedNews(req, res));

// News detail by ID (Protected)
router.get('/:id', authMiddleware, (req, res) => newsController.getNewsById(req, res));

module.exports = router;
