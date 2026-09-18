import api from './api';

export const getUserPreferences = async () => {
  const response = await api.get('/user/preferences');
  return response.data;
};

export const saveUserPreferences = async (preferences) => {
  const response = await api.post('/user/preferences', preferences);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

export const changeUserPassword = async (passwordData) => {
  const response = await api.post('/user/change-password', passwordData);
  return response.data;
};
