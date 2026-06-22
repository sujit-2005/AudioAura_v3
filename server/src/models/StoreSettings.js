import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'AudioAura',
      trim: true,
    },
    businessEmail: {
      type: String,
      default: 'support@audioaura.com',
      trim: true,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      default: '',
      trim: true,
    },
    businessAddress: {
      type: String,
      default: '',
      trim: true,
    },
    shippingFee: {
      type: Number,
      default: 19,
      min: 0,
    },
    freeShippingThreshold: {
      type: Number,
      default: 250,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 8,
      min: 0,
      max: 100,
    },
    contactEmail: {
      type: String,
      default: 'hello@audioaura.com',
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;
