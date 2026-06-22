import assert from 'node:assert/strict';
import test from 'node:test';

import {
  escapeRegex,
  MAX_LIMIT,
  parseProductQuery,
} from '../src/utils/productQuery.js';

test('uses stable defaults for an unfiltered catalog request', () => {
  const result = parseProductQuery({});

  assert.deepEqual(result.filter, {});
  assert.deepEqual(result.sort, { createdAt: -1, _id: 1 });
  assert.equal(result.page, 1);
  assert.equal(result.limit, 12);
  assert.equal(result.skip, 0);
});

test('builds search, category, brand, price, and rating filters', () => {
  const result = parseProductQuery({
    search: 'sony',
    category: 'headphones',
    brand: 'Sony',
    minPrice: '100',
    maxPrice: '500',
    rating: '4',
  });

  assert.equal(result.filter.$or.length, 3);
  assert.equal(result.filter.$or[0].name.source, 'sony');
  assert.equal(result.filter.$or[0].name.flags, 'i');
  assert.equal(result.filter.category, 'Headphones');
  assert.equal(result.filter.brand.source, '^Sony$');
  assert.deepEqual(result.filter.price, { $gte: 100, $lte: 500 });
  assert.deepEqual(result.filter.rating, { $gte: 4 });
});

test('supports every documented sorting option', () => {
  assert.deepEqual(parseProductQuery({ sort: 'price_asc' }).sort, {
    price: 1,
    _id: 1,
  });
  assert.deepEqual(parseProductQuery({ sort: 'price_desc' }).sort, {
    price: -1,
    _id: 1,
  });
  assert.deepEqual(parseProductQuery({ sort: 'rating_desc' }).sort, {
    rating: -1,
    _id: 1,
  });
  assert.deepEqual(parseProductQuery({ sort: 'newest' }).sort, {
    createdAt: -1,
    _id: 1,
  });
});

test('calculates pagination offset', () => {
  const result = parseProductQuery({ page: '3', limit: '5' });

  assert.equal(result.page, 3);
  assert.equal(result.limit, 5);
  assert.equal(result.skip, 10);
});

test('escapes regular expression characters in user search text', () => {
  assert.equal(escapeRegex('sony.*(pro)'), 'sony\\.\\*\\(pro\\)');
});

test('rejects unsupported or unsafe query values', () => {
  assert.throws(
    () => parseProductQuery({ category: 'Televisions' }),
    /not a supported product category/,
  );
  assert.throws(
    () => parseProductQuery({ minPrice: '500', maxPrice: '100' }),
    /minPrice cannot be greater/,
  );
  assert.throws(
    () => parseProductQuery({ rating: '6' }),
    /rating cannot exceed 5/,
  );
  assert.throws(
    () => parseProductQuery({ sort: 'popular' }),
    /sort must be one of/,
  );
  assert.throws(
    () => parseProductQuery({ limit: String(MAX_LIMIT + 1) }),
    new RegExp(`limit cannot exceed ${MAX_LIMIT}`),
  );
  assert.throws(
    () => parseProductQuery({ page: '1.5' }),
    /page must be a whole number/,
  );
});
