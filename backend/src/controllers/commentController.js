const Comment = require('../models/commentModel');

const getComments = async (req, res) => {
  try {
    const { webtoonId, chapterNo } = req.params;
    const comments = await Comment.getCommentsByChapter(webtoonId, chapterNo);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { webtoonId, chapterNo, content } = req.body;
    const insertId = await Comment.addComment(req.user.id, webtoonId, chapterNo, content);
    res.status(201).json({ id: insertId, user_id: req.user.id, webtoonId, chapterNo, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const affectedRows = await Comment.deleteComment(req.params.id, req.user.id, req.user.role);
    if (affectedRows > 0) {
      res.json({ message: 'Comment deleted' });
    } else {
      res.status(404).json({ message: 'Comment not found or unauthorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
