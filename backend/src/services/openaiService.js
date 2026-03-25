const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateChatResponse = async (messages, webtoonContext) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API Key is not configured in the backend environment.');
  }

  try {
    const systemPrompt = `You are an expert manga and webtoon assistant embedded inside a reading app.
Context about the current webtoon/manga being read by the user:
Title: ${webtoonContext?.title || 'Unknown Webtoon'}
Description: ${webtoonContext?.description || 'No description available'}
Author: ${webtoonContext?.author || 'Unknown'}
Current Chapter: ${webtoonContext?.chapterNo || 'Unknown'}

Please answer the user's questions clearly, concisely, and in an engaging tone. If they ask for a chapter summary, base it on the webtoon's plot using your knowledge of the series and the provided description. Try to avoid massive spoilers for future chapters unless explicitly asked.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    return response.choices[0].message;
  } catch (error) {
    console.error('[OpenAI] Error generating chat response:', error);
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
