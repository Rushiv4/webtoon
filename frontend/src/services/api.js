import axios from 'axios';

const api = axios.create({
  baseURL: 'https://webtoon-whlx.onrender.com/api',
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (e) {
    console.warn('API interceptor error:', e);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;
