import httpClient from './httpClient';

const createOrder = async (payload) => {
  const response = await httpClient.post('/orders', payload);

  return response.data;
};

const getMyOrders = async () => {
  const response = await httpClient.get('/orders/mine');

  return response.data;
};

const getAllOrders = async () => {
  const response = await httpClient.get('/orders');

  return response.data;
};

export { createOrder, getAllOrders, getMyOrders };
