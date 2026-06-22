import 'dotenv/config';

import mongoose from 'mongoose';

import connectDatabase from '../src/config/database.js';
import products from '../src/data/products.js';
import Product from '../src/models/Product.js';

const seedProducts = async () => {
  try {
    await connectDatabase();

    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(products);

    console.log(`Seeded ${insertedProducts.length} AudioAura products`);
  } catch (error) {
    console.error(`Product seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
