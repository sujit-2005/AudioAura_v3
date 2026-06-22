import 'dotenv/config';

import app from './app.js';
import connectDatabase from './config/database.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`AudioAura API listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Failed to start AudioAura API: ${error.message}`);
    process.exit(1);
  }
};

startServer();
