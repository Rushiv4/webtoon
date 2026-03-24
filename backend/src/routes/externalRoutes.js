const express = require('express');
const router = express.Router();
const axios = require('axios');
const mangaDexService = require('../services/mangaDexService');

// ── Image Proxy ────────────────────────────────────────────────────
// MangaDex@Home images block direct browser requests (hotlink protection).
// This proxy fetches the image server-side and streams it to the client.
router.get('/image-proxy', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'url param required' });

    // Only allow mangadex CDN domains for security
    const allowedHosts = ['uploads.mangadex.org', 'cmdxd98sb0x3yprd.mangadex.network'];
    try {
        const parsed = new URL(url);
        if (!allowedHosts.some(h => parsed.hostname.endsWith(h))) {
            return res.status(403).json({ error: 'Domain not allowed' });
        }
    } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'Referer': 'https://mangadex.org/',
                'User-Agent': 'WebtoonReadingApp/1.0.0 (rdhane4@gmail.com)',
            },
            timeout: 15000,
        });

        const contentType = response.headers['content-type'] || 'image/jpeg';
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=86400'); // cache 24h
        res.send(Buffer.from(response.data));
    } catch (error) {
        console.error('[ERROR] image-proxy:', error.message);
        res.status(502).json({ error: 'Failed to fetch image' });
    }
});

// Search by title
router.get('/search', async (req, res) => {
    try {
        const { title, limit } = req.query;
        if (!title) return res.status(400).json({ error: 'Title query parameter is required' });
        const results = await mangaDexService.searchManga(title, limit);
        res.json(results);
    } catch (error) {
        console.error('[ERROR] /external/search:', error.message);
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
        console.error('[ERROR] /external/trending:', error.message);
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