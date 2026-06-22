# AudioAura client

The AudioAura client is a Vite-powered React single-page application.

## Local setup

1. Install dependencies:

   ```powershell
   cd client
   npm install
   ```

2. Start the Express API on port 5000.

3. Start the React development server:

   ```powershell
   npm run dev
   ```

4. Open `http://localhost:5173`.

Vite proxies local `/api` requests to `http://localhost:5000`. For a deployed
API, copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the public API
URL.

## Main pages

- `/`: Apple-inspired AudioAura homepage.
- `/products`: URL-synced catalog with search, filters, sorting, and pagination.
- `/products/:slug`: product details, gallery, specifications, related products,
  and add-to-cart.
- `/cart`: authenticated persistent cart.
- `/checkout`: authenticated fake checkout.
- `/orders`: authenticated order history.
- `/login` and `/register`: authentication UI.
- `/admin`: admin-only dashboard for products, inventory, and orders.
