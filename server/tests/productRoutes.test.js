import assert from 'node:assert/strict';
import test from 'node:test';

import app from '../src/app.js';
import Product from '../src/models/Product.js';

test('GET /api/products returns filtered pagination metadata', async () => {
  const originalFind = Product.find;
  const originalCountDocuments = Product.countDocuments;
  const captured = {};
  const products = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Sony WH-1000XM5',
      price: 399.99,
      rating: 4.8,
    },
  ];

  Product.find = (filter) => {
    captured.filter = filter;

    return {
      sort(sort) {
        captured.sort = sort;
        return this;
      },
      skip(skip) {
        captured.skip = skip;
        return this;
      },
      limit(limit) {
        captured.limit = limit;
        return this;
      },
      async lean() {
        return products;
      },
    };
  };

  Product.countDocuments = async (filter) => {
    captured.countFilter = filter;
    return 13;
  };

  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    const response = await fetch(
      `http://127.0.0.1:${port}/api/products?search=sony&category=Headphones&brand=Sony&minPrice=100&maxPrice=500&rating=4&sort=price_asc&page=2&limit=5`,
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.count, 1);
    assert.equal(body.page, 2);
    assert.equal(body.totalPages, 3);
    assert.equal(body.totalProducts, 13);
    assert.deepEqual(body.data, products);
    assert.equal(captured.filter.category, 'Headphones');
    assert.deepEqual(captured.filter.price, { $gte: 100, $lte: 500 });
    assert.deepEqual(captured.filter.rating, { $gte: 4 });
    assert.deepEqual(captured.sort, { price: 1, _id: 1 });
    assert.equal(captured.skip, 5);
    assert.equal(captured.limit, 5);
    assert.strictEqual(captured.filter, captured.countFilter);
  } finally {
    Product.find = originalFind;
    Product.countDocuments = originalCountDocuments;
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /api/products returns 400 for invalid query parameters', async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    const response = await fetch(
      `http://127.0.0.1:${port}/api/products?page=0`,
    );
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
      success: false,
      message: 'page must be at least 1',
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
