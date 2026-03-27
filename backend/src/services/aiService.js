const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateChatResponse = async (messages, webtoonContext) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_free_gemini_api_key_here') {
    throw new Error('Gemini API Key is not configured in the backend environment.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: "models/gemini-1.5-flash"
    });

    const systemInstruction = `You are an expert manga and webtoon assistant embedded inside a reading app.
Context about the current webtoon/manga being read by the user:
Title: ${webtoonContext?.title || 'Unknown Webtoon'}
Description: ${webtoonContext?.description || 'No description available'}
Author: ${webtoonContext?.author || 'Unknown'}
Current Chapter: ${webtoonContext?.chapterNo || 'Unknown'}

Please answer the user's questions clearly, concisely, and in an engaging tone. If they ask for a chapter summary, base it on the webtoon's plot using your knowledge of the series and the provided description. Try to avoid massive spoilers for future chapters unless explicitly asked.

---
`;

    let conversationText = systemInstruction;
    for (const msg of messages) {
      if (msg.role === 'user') {
        conversationText += `User: ${msg.content}\n`;
      } else {
        conversationText += `Assistant: ${msg.content}\n`;
      }
    }
    conversationText += "Assistant:";

    const result = await model.generateContent(conversationText);
    const responseText = result.response.text();

    return { role: 'assistant', content: responseText.trim() };
  } catch (error) {
    console.error('[Gemini API] Error generating chat response:', error);
    throw error;
  }
};

const generateChapterSummary = async (webtoonContext) => {
  return generateChatResponse([
    { role: "user", content: `Please provide a brief, engaging summary of the plot up to chapter ${webtoonContext?.chapterNo || 'this point'}.` }
  ], webtoonContext);
};

module.exports = {
  generateChatResponse,
  generateChapterSummary
};
