const pool = require('../config/db');

// Get all chapters for a webtoon
const getChaptersByWebtoonId = async (webtoonId) => {
  const result = await pool.query('SELECT * FROM chapters WHERE webtoon_id = $1 ORDER BY chapter_no ASC', [webtoonId]);
  return result.rows;
};

// Get single chapter by ID
const getChapterById = async (id) => {
  const result = await pool.query('SELECT * FROM chapters WHERE id = $1', [id]);
  return result.rows[0];
};

// Get chapter images by chapter ID
const getChapterImages = async (chapterId) => {
  const result = await pool.query('SELECT * FROM images WHERE chapter_id = $1 ORDER BY sequence_no ASC', [chapterId]);
  return result.rows;
};

// Admin: Create Chapter
const createChapter = async (webtoonId, title, chapterNo) => {
  const result = await pool.query(
    'INSERT INTO chapters (webtoon_id, title, chapter_no) VALUES ($1, $2, $3) RETURNING id',
    [webtoonId, title, chapterNo]
  );
  return result.rows[0].id;
};

// Admin: Add image to chapter
const addImageToChapter = async (chapterId, sequenceNo, imageUrl) => {
  const result = await pool.query(
    'INSERT INTO images (chapter_id, sequence_no, image_url) VALUES ($1, $2, $3) RETURNING id',
    [chapterId, sequenceNo, imageUrl]
  );
  return result.rows[0].id;
};

// Admin: Delete Chapter
const deleteChapter = async (id) => {
  const result = await pool.query('DELETE FROM chapters WHERE id=$1', [id]);
  return result.rowCount;
};

module.exports = {
  getChaptersByWebtoonId,
  getChapterById,
  getChapterImages,
  createChapter,
  addImageToChapter,
  deleteChapter
};
