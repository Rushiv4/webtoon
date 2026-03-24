const express = require('express');
const router = express.Router();
const {
  getAllUsers, deleteUser,
  getFavorites, toggleFavorite,
  getExternalFavorites, toggleExternalFavorite, checkExternalFavorite
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin User Management
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id').delete(protect, admin, deleteUser);

// Internal Favorites
router.route('/favorites').get(protect, getFavorites).post(protect, toggleFavorite);

// External Favorites (MangaDex/Global Library)
router.route('/favorites/external').get(protect, getExternalFavorites).post(protect, toggleExternalFavorite);
router.route('/favorites/external/check/:externalId').get(protect, checkExternalFavorite);

module.exports = router;
