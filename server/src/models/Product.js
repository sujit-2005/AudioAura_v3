import mongoose from 'mongoose';

const PRODUCT_CATEGORIES = [
  'Headphones',
  'Earbuds',
  'Speakers',
  'Soundbars',
  'DACs',
  'Amplifiers',
  'Microphones',
  'Accessories',
];

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'An image URL is required'],
      trim: true,
    },
    altText: {
      type: String,
      required: [true, 'Image alt text is required'],
      trim: true,
      maxlength: [160, 'Image alt text cannot exceed 160 characters'],
    },
  },
  {
    _id: false,
  },
);

const specificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A specification name is required'],
      trim: true,
      maxlength: [80, 'Specification names cannot exceed 80 characters'],
    },
    value: {
      type: String,
      required: [true, 'A specification value is required'],
      trim: true,
      maxlength: [200, 'Specification values cannot exceed 200 characters'],
    },
  },
  {
    _id: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must contain at least 2 characters'],
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [140, 'Product slug cannot exceed 140 characters'],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Product slug must contain lowercase letters, numbers, and hyphens only',
      ],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
      maxlength: [80, 'Product brand cannot exceed 80 characters'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: '{VALUE} is not a supported product category',
      },
    },
    shortDescription: {
      type: String,
      required: [true, 'A short product description is required'],
      trim: true,
      minlength: [10, 'Short description must contain at least 10 characters'],
      maxlength: [240, 'Short description cannot exceed 240 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'A full product description is required'],
      trim: true,
      minlength: [30, 'Full description must contain at least 30 characters'],
      maxlength: [5000, 'Full description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Product price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: null,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator(value) {
          return value === null || value < this.price;
        },
        message: 'Discount price must be lower than the regular price',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Product stock cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Product stock must be a whole number',
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Product rating cannot be lower than 0'],
      max: [5, 'Product rating cannot be higher than 5'],
    },
    images: {
      type: [imageSchema],
      required: [true, 'At least one product image is required'],
      validate: {
        validator(images) {
          return images.length > 0;
        },
        message: 'At least one product image is required',
      },
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export { PRODUCT_CATEGORIES };
export default Product;
