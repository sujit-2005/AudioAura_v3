# AudioAura server

The AudioAura server is a Node.js application that exposes an Express REST API
and connects to MongoDB through Mongoose.

## Local setup

1. Install dependencies:

   ```powershell
   cd server
   npm install
   ```

2. Copy `.env.example` to `.env`.

3. Ensure MongoDB is running locally, or replace `MONGODB_URI` with a MongoDB
   Atlas connection string.

4. Start the development server:

   ```powershell
   npm run dev
   ```

5. Open `http://localhost:5000/api/health`.

## Scripts

- `npm run dev`: starts the API with Nodemon and restarts after source changes.
- `npm start`: starts the API with Node.js, suitable for production hosting.
- `npm run seed`: replaces the current product collection with sample products.
- `npm test`: runs the automated backend tests.

## Product catalog endpoint

`GET /api/products` supports these optional query parameters:

- `search`: partial, case-insensitive name, brand, or category search.
- `category`: one supported AudioAura category.
- `brand`: exact, case-insensitive brand match.
- `minPrice` and `maxPrice`: regular-price range.
- `rating`: minimum rating from 0 through 5.
- `sort`: `price_asc`, `price_desc`, `rating_desc`, or `newest`.
- `page`: positive page number; defaults to 1.
- `limit`: results per page from 1 through 100; defaults to 12.

Example:

```text
GET /api/products?category=Headphones&minPrice=100&rating=4&sort=price_asc&page=1&limit=12
```

## Main API routes

- `GET /api/health`: API health check.
- `GET /api/products`: catalog listing with search, filters, sorting, and
  pagination.
- `GET /api/products/slug/:slug`: product details by public slug.
- `GET /api/products/slug/:slug/related`: related products by category.
- `POST /api/auth/register`: create a customer account.
- `POST /api/auth/login`: log in and receive a JWT.
- `GET /api/auth/me`: read the authenticated user.
- `GET /api/cart`: read the authenticated user's persistent cart.
- `POST /api/cart/items`: add a product to cart.
- `PUT /api/cart/items/:productId`: update cart quantity.
- `DELETE /api/cart/items/:productId`: remove a cart item.
- `POST /api/orders`: place a fake checkout order and reduce inventory.
- `GET /api/orders/mine`: view the authenticated user's order history.
- `GET /api/orders`: admin-only order management.
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`:
  admin-only product management.

## Admin testing

The register endpoint creates normal customers. To test the admin dashboard,
register a user, then update that user in MongoDB Compass:

```json
{
  "role": "admin"
}
```

Log out and back in so the JWT includes the updated admin role.
