import httpClient from './httpClient';

const register = async (payload) => {
  const response = await httpClient.post('/auth/register', payload);

  return response.data;
};

const login = async (payload) => {
  const response = await httpClient.post('/auth/login', payload);

  return response.data;
};

const getMe = async () => {
  const response = await httpClient.get('/auth/me');

  return response.data;
};

export { getMe, login, register };
