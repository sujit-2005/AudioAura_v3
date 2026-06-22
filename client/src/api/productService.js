import httpClient from './httpClient';

const getProducts = async (params, signal) => {
  const response = await httpClient.get('/products', {
    params,
    signal,
  });

  return response.data;
};

const getProductBySlug = async (slug, signal) => {
  const response = await httpClient.get(`/products/slug/${slug}`, { signal });

  return response.data;
};

const getRelatedProducts = async (slug, signal) => {
  const response = await httpClient.get(`/products/slug/${slug}/related`, {
    signal,
  });

  return response.data;
};

const createProduct = async (payload) => {
  const response = await httpClient.post('/products', payload);

  return response.data;
};

const updateProduct = async (id, payload) => {
  const response = await httpClient.put(`/products/${id}`, payload);

  return response.data;
};

const deleteProduct = async (id) => {
  const response = await httpClient.delete(`/products/${id}`);

  return response.data;
};

export {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  updateProduct,
};
