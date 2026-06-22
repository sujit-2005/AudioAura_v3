import mongoose from 'mongoose';

import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import StoreSettings from '../models/StoreSettings.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeOrderStatus = (status) => (status === 'Placed' ? 'Pending' : status);

const formatOrder = (order) => ({
  ...order,
  status: normalizeOrderStatus(order.status),
});

const startOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfWeek = (date = new Date()) => {
  const day = startOfDay(date);
  day.setDate(day.getDate() - day.getDay());
  return day;
};

const startOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const startOfYear = (date = new Date()) =>
  new Date(date.getFullYear(), 0, 1);

const revenueSince = async (date) => {
  const [result] = await Order.aggregate([
    { $match: { createdAt: { $gte: date }, status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
  ]);

  return { revenue: result?.total || 0, orders: result?.orders || 0 };
};

const buildCsv = (rows) => {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => {
    const text = value === null || value === undefined ? '' : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(',')),
  ].join('\n');
};

const buildExcelXml = (rows) => {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : ['Message'];
  const safe = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const bodyRows = rows.length > 0 ? rows : [{ Message: 'No data available' }];

  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="AudioAura Report">
    <Table>
      <Row>${headers.map((header) => `<Cell><Data ss:Type="String">${safe(header)}</Data></Cell>`).join('')}</Row>
      ${bodyRows.map((row) => `<Row>${headers.map((header) => `<Cell><Data ss:Type="String">${safe(row[header])}</Data></Cell>`).join('')}</Row>`).join('')}
    </Table>
  </Worksheet>
</Workbook>`;
};

const getDashboard = async (request, response, next) => {
  try {
    const today = startOfDay();
    const week = startOfWeek();
    const month = startOfMonth();
    const year = startOfYear();
    const [revenueResult, totalOrders, totalProducts, totalCustomers, recentOrders, recentCustomers, lowStockProducts] =
      await Promise.all([
        Order.aggregate([
          { $match: { status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: { $in: ['user', 'customer'] } }),
        Order.find({})
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        User.find({ role: { $in: ['user', 'customer'] } })
          .select('name email createdAt isDisabled')
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        Product.find({ stock: { $lt: 5 } })
          .select('name brand category stock images')
          .sort({ stock: 1, name: 1 })
          .limit(8)
          .lean(),
      ]);
    const [
      todayStats,
      weekStats,
      monthStats,
      yearStats,
      topProducts,
      topCategories,
      revenueTrend,
      categoryPerformance,
    ] = await Promise.all([
      revenueSince(today),
      revenueSince(week),
      revenueSince(month),
      revenueSince(year),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, units: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { units: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: '$product.category', units: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { revenue: -1 } },
        { $limit: 6 },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * DAY_MS) }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: '$product.category', value: { $sum: '$items.quantity' } } },
        { $sort: { value: -1 } },
      ]),
    ]);
    const previousMonth = await revenueSince(new Date(month.getFullYear(), month.getMonth() - 1, 1));
    const previousMonthEndRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(month.getFullYear(), month.getMonth() - 1, 1), $lt: month }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const previousRevenue = previousMonthEndRevenue[0]?.total || previousMonth.revenue || 0;
    const revenueGrowth = previousRevenue > 0
      ? Number((((monthStats.revenue - previousRevenue) / previousRevenue) * 100).toFixed(2))
      : monthStats.revenue > 0 ? 100 : 0;

    response.status(200).json({
      success: true,
      data: {
        metrics: {
          totalRevenue: revenueResult[0]?.total || 0,
          totalOrders,
          totalProducts,
          totalCustomers,
        },
        recentOrders: recentOrders.map(formatOrder),
        recentCustomers,
        lowStockProducts,
        analytics: {
          revenueToday: todayStats.revenue,
          revenueThisWeek: weekStats.revenue,
          revenueThisMonth: monthStats.revenue,
          revenueThisYear: yearStats.revenue,
          ordersToday: todayStats.orders,
          ordersThisWeek: weekStats.orders,
          ordersThisMonth: monthStats.orders,
          topSellingProducts: topProducts,
          topCategories,
          revenueGrowth,
          revenueTrend,
          categoryPerformance,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (request, response, next) => {
  try {
    const { search = '', rating = '', visibility = 'all' } = request.query;
    const filter = {};

    if (rating) filter.rating = Number(rating);
    if (visibility === 'hidden') filter.isHidden = true;
    if (visibility === 'visible') filter.isHidden = false;

    const reviews = await Review.find(filter)
      .populate('customer', 'name email')
      .populate('product', 'name brand')
      .sort({ createdAt: -1 })
      .lean();
    const normalizedSearch = search.trim().toLowerCase();
    const filteredReviews = normalizedSearch
      ? reviews.filter((review) =>
          [review.customer?.name, review.customer?.email, review.product?.name, review.comment]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedSearch)),
        )
      : reviews;

    response.status(200).json({ success: true, count: filteredReviews.length, data: filteredReviews });
  } catch (error) {
    next(error);
  }
};

const updateReviewVisibility = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid review ID', 400);
    }

    const review = await Review.findByIdAndUpdate(
      request.params.id,
      { isHidden: Boolean(request.body.hidden) },
      { new: true, runValidators: true },
    )
      .populate('customer', 'name email')
      .populate('product', 'name brand');

    if (!review) throw new AppError('Review not found', 404);

    response.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid review ID', 400);
    }

    const review = await Review.findByIdAndDelete(request.params.id);
    if (!review) throw new AppError('Review not found', 404);

    response.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

const getCoupons = async (request, response, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    response.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (request, response, next) => {
  try {
    const coupon = await Coupon.create(request.body);
    response.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid coupon ID', 400);
    }

    const coupon = await Coupon.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) throw new AppError('Coupon not found', 404);

    response.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid coupon ID', 400);
    }

    const coupon = await Coupon.findByIdAndDelete(request.params.id);
    if (!coupon) throw new AppError('Coupon not found', 404);

    response.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

const getReports = async (request, response, next) => {
  try {
    const [sales, revenue, inventory, customers] = await Promise.all([
      Order.countDocuments(),
      revenueSince(new Date(0)),
      Product.find({ stock: { $lt: 5 } }).select('name stock category').lean(),
      User.countDocuments({ role: { $in: ['user', 'customer'] } }),
    ]);

    response.status(200).json({
      success: true,
      data: {
        salesReport: { totalOrders: sales },
        revenueReport: { totalRevenue: revenue.revenue },
        inventoryReport: { lowStockCount: inventory.length, lowStockProducts: inventory },
        customerReport: { totalCustomers: customers },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getReportRows = async (type) => {
  if (type === 'sales' || type === 'revenue') {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).lean();
    return orders.map((order) => ({
      orderId: order._id,
      customer: order.user?.email || order.shippingAddress.email,
      status: normalizeOrderStatus(order.status),
      total: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
    }));
  }

  if (type === 'inventory') {
    const products = await Product.find({}).sort({ stock: 1 }).lean();
    return products.map((product) => ({
      product: product.name,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
    }));
  }

  if (type === 'customers') {
    const customers = await User.find({ role: { $in: ['user', 'customer'] } }).sort({ createdAt: -1 }).lean();
    return customers.map((customer) => ({
      name: customer.name,
      email: customer.email,
      disabled: Boolean(customer.isDisabled),
      joined: customer.createdAt.toISOString(),
    }));
  }

  throw new AppError('Unsupported report type', 400);
};

const exportReport = async (request, response, next) => {
  try {
    const { type, format = 'csv' } = request.params;
    const rows = await getReportRows(type);

    if (format === 'xlsx' || format === 'xls') {
      response.setHeader('Content-Type', 'application/vnd.ms-excel');
      response.setHeader('Content-Disposition', `attachment; filename="audioaura-${type}-report.xls"`);
      return response.status(200).send(buildExcelXml(rows));
    }

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', `attachment; filename="audioaura-${type}-report.csv"`);
    return response.status(200).send(buildCsv(rows));
  } catch (error) {
    return next(error);
  }
};

const getInsights = async (request, response, next) => {
  try {
    const [bestProduct, highestRevenueProduct, highestRevenueCategory, mostActiveCustomer, lowStockAlerts] =
      await Promise.all([
        Order.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.product', name: { $first: '$items.name' }, units: { $sum: '$items.quantity' } } },
          { $sort: { units: -1 } },
          { $limit: 1 },
        ]),
        Order.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.product', name: { $first: '$items.name' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
          { $sort: { revenue: -1 } },
          { $limit: 1 },
        ]),
        Order.aggregate([
          { $unwind: '$items' },
          { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
          { $unwind: '$product' },
          { $group: { _id: '$product.category', revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
          { $sort: { revenue: -1 } },
          { $limit: 1 },
        ]),
        Order.aggregate([
          { $group: { _id: '$user', orders: { $sum: 1 }, spend: { $sum: '$totalPrice' } } },
          { $sort: { orders: -1, spend: -1 } },
          { $limit: 1 },
          { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'customer' } },
          { $unwind: '$customer' },
          { $project: { name: '$customer.name', email: '$customer.email', orders: 1, spend: 1 } },
        ]),
        Product.find({ stock: { $lt: 5 } }).select('name stock category').sort({ stock: 1 }).lean(),
      ]);

    response.status(200).json({
      success: true,
      data: {
        bestSellingProduct: bestProduct[0] || null,
        highestRevenueProduct: highestRevenueProduct[0] || null,
        highestRevenueCategory: highestRevenueCategory[0] || null,
        mostActiveCustomer: mostActiveCustomer[0] || null,
        lowStockAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (request, response, next) => {
  try {
    const [orders, lowStock, customers, expiringCoupons] = await Promise.all([
      Order.find({ createdAt: { $gte: new Date(Date.now() - 7 * DAY_MS) } }).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({ stock: { $lt: 5 } }).sort({ stock: 1 }).limit(5).lean(),
      User.find({ role: { $in: ['user', 'customer'] }, createdAt: { $gte: new Date(Date.now() - 7 * DAY_MS) } }).sort({ createdAt: -1 }).limit(5).lean(),
      Coupon.find({ expiryDate: { $lte: new Date(Date.now() + 7 * DAY_MS) }, isEnabled: true }).sort({ expiryDate: 1 }).limit(5).lean(),
    ]);
    const notifications = [
      ...orders.map((order) => ({ type: 'New Order', message: `Order #${order._id.toString().slice(-6).toUpperCase()} was placed`, createdAt: order.createdAt })),
      ...lowStock.map((product) => ({ type: 'Low Inventory', message: `${product.name} has ${product.stock} units left`, createdAt: product.updatedAt })),
      ...customers.map((customer) => ({ type: 'New Customer', message: `${customer.name} joined AudioAura`, createdAt: customer.createdAt })),
      ...expiringCoupons.map((coupon) => ({ type: 'Coupon Expiring', message: `${coupon.code} expires soon`, createdAt: coupon.expiryDate })),
    ].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

    response.status(200).json({ success: true, unreadCount: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

const getSettings = async (request, response, next) => {
  try {
    const [settings] = await StoreSettings.find({});
    const data = settings || await StoreSettings.create({});
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (request, response, next) => {
  try {
    const settings = await StoreSettings.findOneAndUpdate({}, request.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    response.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const getInventory = async (request, response, next) => {
  try {
    const products = await Product.find({})
      .select('name brand category stock images price discountPrice')
      .sort({ stock: 1, name: 1 })
      .lean();

    response.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (request, response, next) => {
  try {
    const { id } = request.params;
    const { action, amount = 1, stock } = request.body;

    if (!mongoose.isObjectIdOrHexString(id)) {
      throw new AppError('Invalid product ID', 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    } else if (action === 'increase') {
      product.stock += Number(amount);
    } else if (action === 'decrease') {
      product.stock = Math.max(0, product.stock - Number(amount));
    } else {
      throw new AppError('Provide stock or a valid stock action', 400);
    }

    await product.save();

    response.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (request, response, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    response.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map(formatOrder),
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(request.params.id)
      .populate('user', 'name email isDisabled')
      .lean();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    response.status(200).json({
      success: true,
      data: formatOrder(order),
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (request, response, next) => {
  try {
    const { status } = request.body;

    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid order ID', 400);
    }

    if (!ORDER_STATUSES.includes(status)) {
      throw new AppError('Unsupported order status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      request.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate('user', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    response.status(200).json({
      success: true,
      data: formatOrder(order.toObject()),
    });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (request, response, next) => {
  try {
    const customers = await User.aggregate([
      { $match: { role: { $in: ['user', 'customer'] } } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
          isDisabled: 1,
          orderCount: { $size: '$orders' },
          totalSpend: { $sum: '$orders.totalPrice' },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    response.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (request, response, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid customer ID', 400);
    }

    const [customer] = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(request.params.id) } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
          isDisabled: 1,
          role: 1,
          orders: 1,
          orderCount: { $size: '$orders' },
          totalSpend: { $sum: '$orders.totalPrice' },
        },
      },
    ]);

    if (!customer || customer.role === 'admin') {
      throw new AppError('Customer not found', 404);
    }

    customer.orders = customer.orders
      .sort((first, second) => second.createdAt - first.createdAt)
      .map(formatOrder);

    response.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomerStatus = async (request, response, next) => {
  try {
    const { disabled } = request.body;

    if (!mongoose.isObjectIdOrHexString(request.params.id)) {
      throw new AppError('Invalid customer ID', 400);
    }

    const customer = await User.findOneAndUpdate(
      { _id: request.params.id, role: { $in: ['user', 'customer'] } },
      { isDisabled: Boolean(disabled), role: 'user' },
      { new: true, runValidators: true },
    ).select('name email createdAt isDisabled role');

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    response.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export {
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
};
