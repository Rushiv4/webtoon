const Webtoon = require('../models/webtoonModel');

const getWebtoons = async (req, res) => {
  try {
    const { genre, search } = req.query;
    const webtoons = await Webtoon.getAllWebtoons(genre, search);
    res.json(webtoons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getWebtoonById = async (req, res) => {
  try {
    const webtoon = await Webtoon.getWebtoonById(req.params.id);
    if (webtoon) {
      res.json(webtoon);
    } else {
      res.status(404).json({ message: 'Webtoon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createWebtoon = async (req, res) => {
  const { title, author, genre, description, cover_url } = req.body;
  
  try {
    const insertId = await Webtoon.createWebtoon(title, author, genre, description, cover_url);
    res.status(201).json({ id: insertId, title, author, genre, description, cover_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateWebtoon = async (req, res) => {
  const { title, author, genre, description, cover_url } = req.body;
  
  try {
    const affectedRows = await Webtoon.updateWebtoon(req.params.id, title, author, genre, description, cover_url);
    if (affectedRows > 0) {
      res.json({ message: 'Webtoon updated' });
    } else {
      res.status(404).json({ message: 'Webtoon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteWebtoon = async (req, res) => {
  try {
    const affectedRows = await Webtoon.deleteWebtoon(req.params.id);
    if (affectedRows > 0) {
      res.json({ message: 'Webtoon removed' });
    } else {
      res.status(404).json({ message: 'Webtoon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWebtoons,
  getWebtoonById,
  createWebtoon,
  updateWebtoon,
  deleteWebtoon
};
