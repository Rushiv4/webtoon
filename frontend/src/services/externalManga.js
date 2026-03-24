import api from './api';

const API_URL = '/external';

export const searchMangaDex = async (title) => {
    try {
        const response = await api.get(`${API_URL}/search`, { params: { title } });
        return response.data;
    } catch (error) {
        console.error('Frontend search error:', error);
        throw error;
    }
};

export const getGenreManga = async (tagId, limit = 20) => {
    try {
        const response = await api.get(`${API_URL}/genre/${tagId}`, { params: { limit } });
        return response.data;
    } catch (error) {
        console.error('Frontend genre error:', error);
        throw error;
    }
};

export const getExternalMangaDetails = async (id) => {
    try {
        const response = await api.get(`${API_URL}/manga/${id}`);
        return response.data;
    } catch (error) {
        console.error('Frontend details error:', error);
        throw error;
    }
};

export const getExternalMangaChapters = async (id) => {
    try {
        const response = await api.get(`${API_URL}/manga/${id}/chapters`);
        return response.data;
    } catch (error) {
        console.error('Frontend chapters error:', error);
        throw error;
    }
};

export const getTrendingManga = async (limit = 10) => {
    try {
        const response = await api.get(`${API_URL}/trending`, { params: { limit } });
        return response.data;
    } catch (error) {
        console.error('Frontend trending error:', error);
        throw error;
    }
};

export const getExternalChapterImages = async (id) => {
    try {
        const response = await api.get(`${API_URL}/chapter/${id}/images`);
        return response.data;
    } catch (error) {
        console.error('Frontend chapter images error:', error);
        throw error;
    }
};
