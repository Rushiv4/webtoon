const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, firebaseLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/firebase-login', firebaseLogin);
router.get('/profile', protect, getUserProfile);

module.exports = router;
