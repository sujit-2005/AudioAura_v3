import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [32, 'Coupon code cannot exceed 32 characters'],
      match: [/^[A-Z0-9_-]+$/, 'Coupon code can only contain letters, numbers, hyphens, and underscores'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: Number,
      required: [true, 'Usage limit is required'],
      min: [1, 'Usage limit must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Usage limit must be a whole number',
      },
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

couponSchema.index({ expiryDate: 1 });
couponSchema.index({ isEnabled: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
