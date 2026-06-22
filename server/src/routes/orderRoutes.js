import express from 'express';

import {
  createOrder,
  getAllOrders,
  getMyOrders,
} from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/', adminOnly, getAllOrders);

export default router;
