const Chapter = require('../models/chapterModel');

const getChaptersByWebtoonId = async (req, res) => {
  try {
    const chapters = await Chapter.getChaptersByWebtoonId(req.params.webtoonId);
    res.json(chapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.getChapterById(req.params.id);
    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getChapterImages = async (req, res) => {
  try {
    const images = await Chapter.getChapterImages(req.params.id);
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createChapter = async (req, res) => {
  const { webtoonId, title, chapterNo } = req.body;
  try {
    const insertId = await Chapter.createChapter(webtoonId, title, chapterNo);
    res.status(201).json({ id: insertId, webtoonId, title, chapterNo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addImageToChapter = async (req, res) => {
  const { sequenceNo, imageUrl } = req.body;
  try {
    const insertId = await Chapter.addImageToChapter(req.params.id, sequenceNo, imageUrl);
    res.status(201).json({ id: insertId, chapter_id: req.params.id, sequence_no: sequenceNo, image_url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const affectedRows = await Chapter.deleteChapter(req.params.id);
    if (affectedRows > 0) {
      res.json({ message: 'Chapter removed' });
    } else {
      res.status(404).json({ message: 'Chapter not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChaptersByWebtoonId,
  getChapterById,
  getChapterImages,
  createChapter,
  addImageToChapter,
  deleteChapter
};
