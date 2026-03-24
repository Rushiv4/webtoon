const pool = require('../config/db');
const Favorite = require('../models/favoriteModel');
const ExternalFavorite = require('../models/externalFavoriteModel');

// ── Admin ──────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id=?', [req.params.id]);
    if (result.affectedRows > 0) res.json({ message: 'User removed' });
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Internal Favorites ─────────────────────────────────────────────
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.getFavoritesByUser(req.user.id);
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { webtoonId } = req.body;
    const [check] = await pool.execute('SELECT * FROM favorites WHERE user_id = ? AND webtoon_id = ?', [req.user.id, webtoonId]);
    if (check.length > 0) {
      await Favorite.removeFavorite(req.user.id, webtoonId);
      res.json({ message: 'Removed from favorites', status: 'removed' });
    } else {
      await Favorite.addFavorite(req.user.id, webtoonId);
      res.json({ message: 'Added to favorites', status: 'added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── External Favorites ─────────────────────────────────────────────
const getExternalFavorites = async (req, res) => {
  try {
    const favorites = await ExternalFavorite.getExternalFavoritesByUser(req.user.id);
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleExternalFavorite = async (req, res) => {
  try {
    const { externalId, title, coverUrl } = req.body;
    console.log('[DEBUG] Toggle External Favorite:', { userId: req.user.id, externalId, title });
    if (!externalId) return res.status(400).json({ message: 'externalId required' });

    const isFav = await ExternalFavorite.isExternalFavorite(req.user.id, externalId);
    if (isFav) {
      await ExternalFavorite.removeExternalFavorite(req.user.id, externalId);
      res.json({ status: 'removed' });
    } else {
      await ExternalFavorite.addExternalFavorite(req.user.id, externalId, title, coverUrl);
      res.json({ status: 'added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const checkExternalFavorite = async (req, res) => {
  try {
    console.log('[DEBUG] Check External Favorite:', { userId: req.user.id, externalId: req.params.externalId });
    const isFav = await ExternalFavorite.isExternalFavorite(req.user.id, req.params.externalId);
    res.json({ isFavorite: isFav });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers, deleteUser,
  getFavorites, toggleFavorite,
  getExternalFavorites, toggleExternalFavorite, checkExternalFavorite
};
