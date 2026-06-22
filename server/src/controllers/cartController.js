import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

const cartPopulate = {
  path: 'items.product',
  select: 'name slug brand category price discountPrice stock images',
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const getCart = async (request, response, next) => {
  try {
    const cart = await getOrCreateCart(request.user._id);
    await cart.populate(cartPopulate);

    response.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (request, response, next) => {
  try {
    const { productId, quantity = 1 } = request.body;
    const normalizedQuantity = Number(quantity);

    if (!productId || !Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
      throw new AppError('Product ID and a valid quantity are required', 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < normalizedQuantity) {
      throw new AppError('Not enough stock available', 400);
    }

    const cart = await getOrCreateCart(request.user._id);
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + normalizedQuantity;

      if (product.stock < nextQuantity) {
        throw new AppError('Not enough stock available', 400);
      }

      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({ product: productId, quantity: normalizedQuantity });
    }

    await cart.save();
    await cart.populate(cartPopulate);

    response.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (request, response, next) => {
  try {
    const { productId } = request.params;
    const quantity = Number(request.body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new AppError('Quantity must be a whole number greater than 0', 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Not enough stock available', 400);
    }

    const cart = await getOrCreateCart(request.user._id);
    const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

    if (!item) {
      throw new AppError('Product is not in the cart', 404);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate(cartPopulate);

    response.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (request, response, next) => {
  try {
    const { productId } = request.params;
    const cart = await getOrCreateCart(request.user._id);

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate(cartPopulate);

    response.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (request, response, next) => {
  try {
    const cart = await getOrCreateCart(request.user._id);
    cart.items = [];
    await cart.save();

    response.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export { addToCart, clearCart, getCart, removeCartItem, updateCartItem };
