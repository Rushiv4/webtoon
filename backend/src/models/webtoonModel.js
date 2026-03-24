const pool = require('../config/db');

// Get all webtoons (optional filter by genre or search)
const getAllWebtoons = async (genre, search) => {
  let query = 'SELECT * FROM webtoons';
  let params = [];
  let count = 1;

  if (genre || search) {
    query += ' WHERE';
    if (genre) {
      query += ` genre = $${count++}`;
      params.push(genre);
    }
    if (search) {
      if (genre) query += ' AND';
      query += ` (title ILIKE $${count} OR author ILIKE $${count})`;
      params.push(`%${search}%`);
      count++;
    }
  }
  
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
};

// Get single webtoon by ID
const getWebtoonById = async (id) => {
  const result = await pool.query('SELECT * FROM webtoons WHERE id = $1', [id]);
  return result.rows[0];
};

// Admin: Create Webtoon
const createWebtoon = async (title, author, genre, description, cover_url) => {
  const result = await pool.query(
    'INSERT INTO webtoons (title, author, genre, description, cover_url) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [title, author, genre, description, cover_url]
  );
  return result.rows[0].id;
};

// Admin: Update Webtoon
const updateWebtoon = async (id, title, author, genre, description, cover_url) => {
  const result = await pool.query(
    'UPDATE webtoons SET title=$1, author=$2, genre=$3, description=$4, cover_url=$5 WHERE id=$6',
    [title, author, genre, description, cover_url, id]
  );
  return result.rowCount;
};

// Admin: Delete Webtoon
const deleteWebtoon = async (id) => {
  const result = await pool.query('DELETE FROM webtoons WHERE id=$1', [id]);
  return result.rowCount;
};

module.exports = {
  getAllWebtoons,
  getWebtoonById,
  createWebtoon,
  updateWebtoon,
  deleteWebtoon
};
