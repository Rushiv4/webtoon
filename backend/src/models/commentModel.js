const pool = require('../config/db');

const getCommentsByChapter = async (webtoonId, chapterNo) => {
  const result = await pool.query(
    `SELECT c.id, c.content, c.created_at, u.username 
     FROM comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.webtoon_id = $1 AND c.chapter_no = $2 
     ORDER BY c.created_at DESC`,
    [webtoonId, chapterNo]
  );
  return result.rows;
};

const addComment = async (userId, webtoonId, chapterNo, content) => {
  const result = await pool.query(
    'INSERT INTO comments (user_id, webtoon_id, chapter_no, content) VALUES ($1, $2, $3, $4) RETURNING id',
    [userId, webtoonId, chapterNo, content]
  );
  return result.rows[0].id;
};

const deleteComment = async (commentId, userId, role) => {
  if (role === 'admin') {
    const result = await pool.query('DELETE FROM comments WHERE id=$1', [commentId]);
    return result.rowCount;
  } else {
    const result = await pool.query('DELETE FROM comments WHERE id=$1 AND user_id=$2', [commentId, userId]);
    return result.rowCount;
  }
};

module.exports = {
  getCommentsByChapter,
  addComment,
  deleteComment
};
