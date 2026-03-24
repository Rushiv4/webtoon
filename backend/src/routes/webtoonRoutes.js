const express = require('express');
const router = express.Router();
const { getWebtoons, getWebtoonById, createWebtoon, updateWebtoon, deleteWebtoon } = require('../controllers/webtoonController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getWebtoons).post(protect, admin, createWebtoon);
router.route('/:id').get(getWebtoonById).put(protect, admin, updateWebtoon).delete(protect, admin, deleteWebtoon);

module.exports = router;
