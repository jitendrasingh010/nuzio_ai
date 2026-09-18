import api from './api';

export const getPersonalizedNews = async () => {
  const response = await api.get('/news/personalized');
  return response.data;
};

export const getNewsDetail = async (id) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};
