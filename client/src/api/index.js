import api from './client';

export const getContent = (section) => api.get(`/api/content/${section}`);
export const getFeatures = (params) => api.get('/api/features', { params });
export const getPricing = () => api.get('/api/pricing');
export const getPosts = (params) => api.get('/api/posts', { params });
export const getPost = (slug) => api.get(`/api/posts/${slug}`);
export const submitContact = (data) => api.post('/api/contact', data);
export const sendChat = (data) => api.post('/api/chat', data);

export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const getMe = () => api.get('/api/auth/me');
