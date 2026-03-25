const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { messages, webtoonContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required.' });
    }

    const responseMessage = await aiService.generateChatResponse(messages, webtoonContext || {});
    res.json({ message: responseMessage });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Error generating AI response.' });
  }
});

// POST /api/chat/summarize
router.post('/summarize', async (req, res) => {
  try {
    const { webtoonContext } = req.body;
    
    const responseMessage = await aiService.generateChapterSummary(webtoonContext || {});
    res.json({ message: responseMessage });
  } catch (error) {
    console.error('Summarize API Error:', error);
    res.status(500).json({ error: error.message || 'Error generating chapter summary.' });
  }
});

module.exports = router;
