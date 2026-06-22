import httpClient from './httpClient';

const getCart = async () => {
  const response = await httpClient.get('/cart');

  return response.data;
};

const addCartItem = async (productId, quantity = 1) => {
  const response = await httpClient.post('/cart/items', { productId, quantity });

  return response.data;
};

const updateCartItem = async (productId, quantity) => {
  const response = await httpClient.put(`/cart/items/${productId}`, { quantity });

  return response.data;
};

const removeCartItem = async (productId) => {
  const response = await httpClient.delete(`/cart/items/${productId}`);

  return response.data;
};

export { addCartItem, getCart, removeCartItem, updateCartItem };
