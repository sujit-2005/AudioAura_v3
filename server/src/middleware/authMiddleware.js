import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from './asyncHandler.js';

const protect = asyncHandler(async (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new AppError('The user belonging to this token no longer exists', 401);
  }

  if (user.role === 'customer') {
    user.role = 'user';
    await user.save({ validateBeforeSave: false });
  }

  if (user.isDisabled) {
    throw new AppError('This account has been disabled', 403);
  }

  request.user = user;
  next();
});

const adminOnly = (request, response, next) => {
  if (request.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }

  return next();
};

export { adminOnly, protect };
