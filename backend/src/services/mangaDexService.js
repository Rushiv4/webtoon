const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api.mangadex.org';
const AUTH_URL = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token';

let accessToken = null;
let tokenExpiresAt = null;

const authenticate = async () => {
    // If we already have a valid token, skip authentication
    if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    const {
        MANGADEX_CLIENT_ID,
        MANGADEX_CLIENT_SECRET,
        MANGADEX_USERNAME,
        MANGADEX_PASSWORD
    } = process.env;

    // If no credentials (other than Client ID which can be used for some public stuff), 
    // we might try public requests later, but for authenticated ones:
    if (!MANGADEX_CLIENT_SECRET || MANGADEX_CLIENT_SECRET.includes('YOUR_')) {
        console.warn('MangaDex credentials not fully configured. Some requests may be limited.');
        return null;
    }

    try {
        const response = await axios.post(AUTH_URL, new URLSearchParams({
            grant_type: 'password',
            username: MANGADEX_USERNAME,
            password: MANGADEX_PASSWORD,
            client_id: MANGADEX_CLIENT_ID,
            client_secret: MANGADEX_CLIENT_SECRET
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        accessToken = response.data.access_token;
        tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000; // Buffer of 1 min
        return accessToken;
    } catch (error) {
        console.error('MangaDex Authentication failed:', error.response?.data || error.message);
        return null;
    }
};

const searchManga = async (title, limit = 20) => {
    try {
        const response = await axios.get(`${BASE_URL}/manga`, {
            params: {
                title,
                limit,
                'includes[]': ['cover_art', 'author', 'artist']
            }
        });
        return response.data;
    } catch (error) {
        console.error('MangaDex Search failed:', error.response?.data || error.message);
        throw error;
    }
};

const searchMangaByTag = async (tagId, limit = 20) => {
    try {
        const response = await axios.get(`${BASE_URL}/manga`, {
            params: {
                limit,
                'includedTags[]': [tagId],
                'includes[]': ['cover_art', 'author', 'artist'],
                'contentRating[]': ['safe', 'suggestive'],
                'order[followedCount]': 'desc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('MangaDex Tag Search failed:', error.response?.data || error.message);
        throw error;
    }
};

const getMangaDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/manga/${id}`, {
            params: {
                'includes[]': ['cover_art', 'author', 'artist']
            }
        });
        return response.data;
    } catch (error) {
        console.error('MangaDex Get Details failed:', error.response?.data || error.message);
        throw error;
    }
};

const getMangaChapters = async (id, offset = 0, limit = 500) => {
    try {
        const response = await axios.get(`${BASE_URL}/manga/${id}/feed`, {
            params: {
                limit,
                offset,
                'translatedLanguage[]': ['en'],
                'order[chapter]': 'asc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('MangaDex Get Chapters failed:', error.response?.data || error.message);
        throw error;
    }
};

const getTrendingManga = async (limit = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}/manga`, {
            params: {
                limit,
                'order[followedCount]': 'desc',
                'includes[]': ['cover_art', 'author', 'artist'],
                'contentRating[]': ['safe', 'suggestive']
            }
        });
        return response.data;
    } catch (error) {
        console.error('MangaDex Get Trending failed:', error.response?.data || error.message);
        throw error;
    }
};

const getChapterImages = async (chapterId) => {
    try {
        console.log(`[DEBUG] Fetching metadata for chapter: ${chapterId}`);
        // First get the chapter metadata to check for external URLs
        const chapterRes = await axios.get(`${BASE_URL}/chapter/${chapterId}`);
        const chapterData = chapterRes.data.data;
        const externalUrl = chapterData.attributes.externalUrl;

        console.log(`[DEBUG] Chapter ${chapterId} externalUrl:`, externalUrl);

        // If it's an external chapter, return the URL instead of trying to get images
        if (externalUrl) {
            return { images: [], externalUrl };
        }

        console.log(`[DEBUG] Fetching images from @home for chapter: ${chapterId}`);
        // Otherwise try to get the images from MangaDex@Home
        const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = response.data;
        const { hash, data, dataSaver } = chapter;
        
        console.log(`[DEBUG] MangaDex@Home response for ${chapterId}:`, { 
            hash, 
            pagesCount: data?.length,
            saverCount: dataSaver?.length 
        });

        // Use dataSaver if primary data is empty
        const pages = (data && data.length > 0) ? data : (dataSaver || []);
        const qualityPath = (data && data.length > 0) ? 'data' : 'data-saver';

        if (pages.length === 0) {
             console.warn(`[WARN] No images found in both data and dataSaver for chapter ${chapterId}`);
             // Fallback: point to the MangaDex chapter page itself
             return { images: [], externalUrl: `https://mangadex.org/chapter/${chapterId}` };
        }

        const images = pages.map(filename => `${baseUrl}/${qualityPath}/${hash}/${filename}`);
        console.log(`[DEBUG] Prepared ${images.length} images using ${qualityPath} path.`);
        
        return { images, externalUrl: null };
    } catch (error) {
        console.error(`[ERROR] MangaDex Get Chapter Images failed for ${chapterId}:`, error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    searchManga,
    searchMangaByTag,
    getMangaDetails,
    getMangaChapters,
    getTrendingManga,
    getChapterImages
};
