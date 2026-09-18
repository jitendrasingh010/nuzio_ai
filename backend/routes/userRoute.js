const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User Preferences (Protected)
router.get('/preferences', authMiddleware, (req, res) => userController.getPreferences(req, res));
router.post('/preferences', authMiddleware, (req, res) => userController.savePreferences(req, res));

// Profile Update & Password Change (Protected)
router.put('/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.post('/change-password', authMiddleware, (req, res) => userController.changePassword(req, res));

module.exports = router;