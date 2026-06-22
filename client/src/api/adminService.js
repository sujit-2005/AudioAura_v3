import httpClient from './httpClient';

const adminLogin = async (payload) => {
  const response = await httpClient.post('/auth/admin/login', payload);

  return response.data;
};

const getDashboard = async () => {
  const response = await httpClient.get('/admin/dashboard');

  return response.data;
};

const getNotifications = async () => {
  const response = await httpClient.get('/admin/notifications');

  return response.data;
};

const getInsights = async () => {
  const response = await httpClient.get('/admin/insights');

  return response.data;
};

const getInventory = async () => {
  const response = await httpClient.get('/admin/inventory');

  return response.data;
};

const updateInventory = async (id, payload) => {
  const response = await httpClient.patch(`/admin/inventory/${id}`, payload);

  return response.data;
};

const getAdminOrders = async () => {
  const response = await httpClient.get('/admin/orders');

  return response.data;
};

const getAdminOrder = async (id) => {
  const response = await httpClient.get(`/admin/orders/${id}`);

  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await httpClient.patch(`/admin/orders/${id}/status`, { status });

  return response.data;
};

const getCustomers = async () => {
  const response = await httpClient.get('/admin/customers');

  return response.data;
};

const getCustomer = async (id) => {
  const response = await httpClient.get(`/admin/customers/${id}`);

  return response.data;
};

const updateCustomerStatus = async (id, disabled) => {
  const response = await httpClient.patch(`/admin/customers/${id}/status`, { disabled });

  return response.data;
};

const getReviews = async (params) => {
  const response = await httpClient.get('/admin/reviews', { params });

  return response.data;
};

const updateReviewVisibility = async (id, hidden) => {
  const response = await httpClient.patch(`/admin/reviews/${id}/visibility`, { hidden });

  return response.data;
};

const deleteReview = async (id) => {
  const response = await httpClient.delete(`/admin/reviews/${id}`);

  return response.data;
};

const getCoupons = async () => {
  const response = await httpClient.get('/admin/coupons');

  return response.data;
};

const createCoupon = async (payload) => {
  const response = await httpClient.post('/admin/coupons', payload);

  return response.data;
};

const updateCoupon = async (id, payload) => {
  const response = await httpClient.put(`/admin/coupons/${id}`, payload);

  return response.data;
};

const deleteCoupon = async (id) => {
  const response = await httpClient.delete(`/admin/coupons/${id}`);

  return response.data;
};

const getReports = async () => {
  const response = await httpClient.get('/admin/reports');

  return response.data;
};

const exportReport = async (type, format) => {
  const response = await httpClient.get(`/admin/reports/${type}/${format}`, {
    responseType: 'blob',
  });

  return response.data;
};

const getSettings = async () => {
  const response = await httpClient.get('/admin/settings');

  return response.data;
};

const updateSettings = async (payload) => {
  const response = await httpClient.put('/admin/settings', payload);

  return response.data;
};

export {
  adminLogin,
  createCoupon,
  deleteCoupon,
  deleteReview,
  exportReport,
  getAdminOrder,
  getAdminOrders,
  getCoupons,
  getCustomer,
  getCustomers,
  getDashboard,
  getInsights,
  getInventory,
  getNotifications,
  getReports,
  getReviews,
  getSettings,
  updateCoupon,
  updateCustomerStatus,
  updateInventory,
  updateOrderStatus,
  updateReviewVisibility,
  updateSettings,
};
