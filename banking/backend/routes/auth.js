const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validate, authSchemas } = require('../middleware/validation');

// Public routes
router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);
router.post('/google', authController.googleSignIn);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, validate(authSchemas.update), authController.updateProfile);
router.put('/change-password', auth, validate(authSchemas.changePassword), authController.changePassword);
router.post('/logout', auth, authController.logout);
router.post('/refresh-token', auth, authController.refreshToken);

module.exports = router; 