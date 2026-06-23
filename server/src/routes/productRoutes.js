import express from 'express';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  updateProduct,
  seedProducts,
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/slug/:slug/related', getRelatedProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
