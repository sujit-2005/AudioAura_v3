import express from 'express';

import {
  createCoupon,
  deleteCoupon,
  deleteReview,
  exportReport,
  getCoupons,
  getCustomer,
  getCustomers,
  getDashboard,
  getInsights,
  getInventory,
  getNotifications,
  getOrder,
  getOrders,
  getReports,
  getReviews,
  getSettings,
  updateCoupon,
  updateCustomerStatus,
  updateInventory,
  updateOrderStatus,
  updateReviewVisibility,
  updateSettings,
} from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/notifications', getNotifications);
router.get('/insights', getInsights);
router.get('/inventory', getInventory);
router.patch('/inventory/:id', updateInventory);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomer);
router.patch('/customers/:id/status', updateCustomerStatus);
router.get('/reviews', getReviews);
router.patch('/reviews/:id/visibility', updateReviewVisibility);
router.delete('/reviews/:id', deleteReview);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.get('/reports', getReports);
router.get('/reports/:type/:format', exportReport);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
