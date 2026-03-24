const express = require('express');
const router = express.Router();

const { getChaptersByWebtoonId, getChapterById, getChapterImages, createChapter, addImageToChapter, deleteChapter } = require('../controllers/chapterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/webtoon/:webtoonId').get(getChaptersByWebtoonId);
router.route('/:id').get(getChapterById).delete(protect, admin, deleteChapter);
router.route('/').post(protect, admin, createChapter);
router.route('/:id/images').get(getChapterImages).post(protect, admin, addImageToChapter);

module.exports = router;
