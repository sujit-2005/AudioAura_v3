import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import AppError from '../utils/AppError.js';

const calculateTotals = (items) => {
  const itemsPrice = Number(
    items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2),
  );
  const shippingPrice = itemsPrice > 250 ? 0 : 19;
  const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const createOrder = async (request, response, next) => {
  try {
    const { shippingAddress, paymentMethod = 'Fake Card' } = request.body;

    if (!shippingAddress) {
      throw new AppError('Shipping address is required', 400);
    }

    const cart = await Cart.findOne({ user: request.user._id }).populate(
      'items.product',
    );

    if (!cart || cart.items.length === 0) {
      throw new AppError('Your cart is empty', 400);
    }

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        throw new AppError('One of the cart products no longer exists', 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`${product.name} does not have enough stock`, 400);
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images?.[0]?.url || '',
        price: product.discountPrice ?? product.price,
        quantity: item.quantity,
      });
    }

    const totals = calculateTotals(orderItems);

    const createdOrder = await Order.create({
      user: request.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      ...totals,
    });

    cart.items = [];
    await cart.save();

    response.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (request, response, next) => {
  try {
    const orders = await Order.find({ user: request.user._id })
      .sort({ createdAt: -1 })
      .lean();

    response.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (request, response, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    response.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export { createOrder, getAllOrders, getMyOrders };
