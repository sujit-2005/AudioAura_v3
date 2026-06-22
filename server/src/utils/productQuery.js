import { PRODUCT_CATEGORIES } from '../models/Product.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

const SORT_OPTIONS = {
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: 1 },
  rating_desc: { rating: -1, _id: 1 },
  newest: { createdAt: -1, _id: 1 },
};

class ProductQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProductQueryError';
  }
}

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const readSingleQueryValue = (value, fieldName) => {
  if (Array.isArray(value)) {
    throw new ProductQueryError(`${fieldName} must be provided only once`);
  }

  return typeof value === 'string' ? value.trim() : value;
};

const parseNumber = (value, fieldName, options = {}) => {
  const normalizedValue = readSingleQueryValue(value, fieldName);

  if (normalizedValue === undefined || normalizedValue === '') {
    return undefined;
  }

  const number = Number(normalizedValue);

  if (!Number.isFinite(number)) {
    throw new ProductQueryError(`${fieldName} must be a valid number`);
  }

  if (options.integer && !Number.isInteger(number)) {
    throw new ProductQueryError(`${fieldName} must be a whole number`);
  }

  if (options.min !== undefined && number < options.min) {
    throw new ProductQueryError(`${fieldName} must be at least ${options.min}`);
  }

  if (options.max !== undefined && number > options.max) {
    throw new ProductQueryError(
      `${fieldName} cannot exceed ${options.max}`,
    );
  }

  return number;
};

const parseProductQuery = (query) => {
  const search = readSingleQueryValue(query.search, 'search');
  const categoryInput = readSingleQueryValue(query.category, 'category');
  const brand = readSingleQueryValue(query.brand, 'brand');
  const sortInput = readSingleQueryValue(query.sort, 'sort') || 'newest';

  const page =
    parseNumber(query.page, 'page', { integer: true, min: 1 }) ?? DEFAULT_PAGE;
  const limit =
    parseNumber(query.limit, 'limit', {
      integer: true,
      min: 1,
      max: MAX_LIMIT,
    }) ?? DEFAULT_LIMIT;
  const minPrice = parseNumber(query.minPrice, 'minPrice', { min: 0 });
  const maxPrice = parseNumber(query.maxPrice, 'maxPrice', { min: 0 });
  const rating = parseNumber(query.rating, 'rating', { min: 0, max: 5 });

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new ProductQueryError('minPrice cannot be greater than maxPrice');
  }

  const category = categoryInput
    ? PRODUCT_CATEGORIES.find(
        (supportedCategory) =>
          supportedCategory.toLowerCase() === categoryInput.toLowerCase(),
      )
    : undefined;

  if (categoryInput && !category) {
    throw new ProductQueryError(
      `${categoryInput} is not a supported product category`,
    );
  }

  if (!SORT_OPTIONS[sortInput]) {
    throw new ProductQueryError(
      `sort must be one of: ${Object.keys(SORT_OPTIONS).join(', ')}`,
    );
  }

  const filter = {};

  if (search) {
    const searchExpression = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { name: searchExpression },
      { brand: searchExpression },
      { category: searchExpression },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice;
    }
  }

  if (rating !== undefined) {
    filter.rating = { $gte: rating };
  }

  return {
    filter,
    sort: SORT_OPTIONS[sortInput],
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export {
  MAX_LIMIT,
  ProductQueryError,
  SORT_OPTIONS,
  escapeRegex,
  parseProductQuery,
};
