const pool = require('../config/db');

const getExternalFavoritesByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM external_favorites WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const isExternalFavorite = async (userId, externalId) => {
  const result = await pool.query(
    'SELECT id FROM external_favorites WHERE user_id = $1 AND external_id = $2',
    [userId, externalId]
  );
  return result.rows.length > 0;
};

const addExternalFavorite = async (userId, externalId, title, coverUrl) => {
  const result = await pool.query(
    'INSERT INTO external_favorites (user_id, external_id, title, cover_url) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
    [userId, externalId, title, coverUrl || '']
  );
  return result.rowCount;
};

const removeExternalFavorite = async (userId, externalId) => {
  const result = await pool.query(
    'DELETE FROM external_favorites WHERE user_id = $1 AND external_id = $2',
    [userId, externalId]
  );
  return result.rowCount;
};

module.exports = {
  getExternalFavoritesByUser,
  isExternalFavorite,
  addExternalFavorite,
  removeExternalFavorite
};
