const pool = require('../config/db');

const getFavoritesByUser = async (userId) => {
  const result = await pool.query(
    `SELECT w.* 
     FROM favorites f 
     JOIN webtoons w ON f.webtoon_id = w.id 
     WHERE f.user_id = $1 
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const addFavorite = async (userId, webtoonId) => {
  const result = await pool.query(
    'INSERT INTO favorites (user_id, webtoon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, webtoonId]
  );
  return result.rowCount;
};

const removeFavorite = async (userId, webtoonId) => {
  const result = await pool.query(
    'DELETE FROM favorites WHERE user_id = $1 AND webtoon_id = $2',
    [userId, webtoonId]
  );
  return result.rowCount;
};

module.exports = {
  getFavoritesByUser,
  addFavorite,
  removeFavorite
};
