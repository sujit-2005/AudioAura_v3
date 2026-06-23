import mongoose from 'mongoose';
import products from '../data/products.js';
import Product from '../models/Product.js';
import {
  parseProductQuery,
  ProductQueryError,
} from '../utils/productQuery.js';
import AppError from '../utils/AppError.js';

const getAllProducts = async (request, response) => {
  try {
    const { filter, sort, page, limit, skip } = parseProductQuery(request.query);

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return response.status(200).json({
      success: true,
      count: products.length,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      data: products,
    });
  } catch (error) {
    if (error instanceof ProductQueryError) {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error(`Unable to retrieve products: ${error.message}`);

    return response.status(500).json({
      success: false,
      message: 'Unable to retrieve products',
    });
  }
};

const getProductById = async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return response.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return response.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`Unable to retrieve product: ${error.message}`);

    return response.status(500).json({
      success: false,
      message: 'Unable to retrieve product',
    });
  }
};

const getProductBySlug = async (request, response) => {
  try {
    const product = await Product.findOne({ slug: request.params.slug }).lean();

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return response.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`Unable to retrieve product: ${error.message}`);

    return response.status(500).json({
      success: false,
      message: 'Unable to retrieve product',
    });
  }
};

const getRelatedProducts = async (request, response) => {
  try {
    const product = await Product.findOne({ slug: request.params.slug }).lean();

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return response.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts,
    });
  } catch (error) {
    console.error(`Unable to retrieve related products: ${error.message}`);

    return response.status(500).json({
      success: false,
      message: 'Unable to retrieve related products',
    });
  }
};

const createProduct = async (request, response, next) => {
  try {
    const product = await Product.create(request.body);

    response.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    response.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findByIdAndDelete(request.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    response.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
const seedProducts = async (request, response) => {
  try {
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(products);

    return response.status(200).json({
      success: true,
      count: insertedProducts.length,
      message: 'Products seeded successfully',
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  updateProduct,
  seedProducts,
};
