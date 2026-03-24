const express = require('express');
const router = express.Router();
const mangaDexService = require('../services/mangaDexService');

// Search by title
router.get('/search', async (req, res) => {
    try {
        const { title, limit } = req.query;
        if (!title) return res.status(400).json({ error: 'Title query parameter is required' });
        const results = await mangaDexService.searchManga(title, limit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search' });
    }
});

// Browse by genre/tag
router.get('/genre/:tagId', async (req, res) => {
    try {
        const { limit } = req.query;
        const results = await mangaDexService.searchMangaByTag(req.params.tagId, limit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get genre manga' });
    }
});

// Get Manga Details
router.get('/manga/:id', async (req, res) => {
    try {
        const results = await mangaDexService.getMangaDetails(req.params.id);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get manga details' });
    }
});

// Get Manga Chapters
router.get('/manga/:id/chapters', async (req, res) => {
    try {
        const { offset, limit } = req.query;
        const results = await mangaDexService.getMangaChapters(req.params.id, offset, limit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get chapters' });
    }
});

// Get Trending Manga
router.get('/trending', async (req, res) => {
    try {
        const { limit } = req.query;
        const results = await mangaDexService.getTrendingManga(limit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get trending manga' });
    }
});

// Get Chapter Images
router.get('/chapter/:id/images', async (req, res) => {
    try {
        const results = await mangaDexService.getChapterImages(req.params.id);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get chapter images' });
    }
});

module.exports = router;
