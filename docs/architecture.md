# AudioAura architecture

## 1. Architectural style

AudioAura uses a client-server architecture:

```text
Browser
  |
  | HTTP requests and JSON responses
  v
React client  <---- REST API ---->  Express server  <---->  MongoDB
```

The React application owns presentation and browser interaction. The Express
application owns business rules, validation, authorization, and database
access. MongoDB is never accessed directly by the browser.

Keeping these responsibilities separate makes the system easier to test,
secure, deploy, and change.

## 2. Repository layout

```text
AudioAura/
|-- client/
|   |-- public/
|   `-- src/
|       |-- api/
|       |-- assets/
|       |-- components/
|       |   |-- common/
|       |   |-- layout/
|       |   `-- product/
|       |-- context/
|       |-- hooks/
|       |-- pages/
|       |   |-- admin/
|       |   |-- auth/
|       |   |-- cart/
|       |   `-- products/
|       |-- routes/
|       |-- styles/
|       `-- utils/
|-- server/
|   |-- scripts/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- validators/
|   `-- tests/
|-- docs/
|-- .gitignore
`-- README.md
```

## 3. Frontend responsibilities

### `api/`

Contains Axios configuration and API functions. Components should call these
functions instead of repeating URLs and HTTP configuration.

### `assets/`

Contains local images, icons, and fonts. Product images will normally be stored
as URLs in MongoDB rather than bundled into the React application.

### `components/`

Contains reusable interface pieces.

- `common/`: buttons, inputs, loaders, empty states, and other generic UI.
- `layout/`: header, footer, navigation, and page-shell components.
- `product/`: product cards, price displays, ratings, filters, and galleries.

### `context/`

Contains shared client state that must be available across distant parts of the
component tree. Cart and authentication state are likely candidates. Context
should not become a dumping ground for all state.

### `hooks/`

Contains reusable React behavior such as product fetching or persistent cart
logic.

### `pages/`

Contains route-level screens. Pages compose reusable components and coordinate
data loading; they should avoid becoming collections of duplicated UI code.

### `routes/`

Contains the React Router configuration and, later, protected customer or admin
route wrappers.

### `styles/`

Contains global design tokens, resets, and shared styling. Component-specific
CSS can live beside its component when that improves maintainability.

### `utils/`

Contains small, side-effect-free helpers such as currency formatting.

## 4. Backend responsibilities

AudioAura's backend follows a layered structure:

```text
Route -> Middleware -> Controller -> Service -> Model -> MongoDB
```

### `config/`

Contains infrastructure configuration, including the MongoDB connection and
environment-variable handling.

### `routes/`

Maps HTTP methods and URLs to middleware and controllers. Routes describe the
public API but do not contain business logic.

### `middleware/`

Runs reusable logic during the request pipeline. Examples include error
handling, authentication, authorization, and request validation.

### `controllers/`

Translate HTTP input into application calls and translate results into HTTP
responses. Controllers read parameters, invoke services, and select status
codes.

### `services/`

Contain business use cases, such as creating an order and reducing inventory.
This layer prevents business rules from being trapped inside controllers and
becomes especially valuable as checkout logic grows.

### `models/`

Contain Mongoose schemas and database operations for products, users, carts,
and orders.

### `validators/`

Define rules for incoming data. Client-side validation improves user
experience, but server-side validation is the security boundary.

### `utils/`

Contains backend helpers such as custom error classes and async wrappers.

### `scripts/`

Contains explicit operational scripts, such as inserting development product
data into MongoDB.

### `tests/`

Contains automated backend tests. Tests are separated from production code in
this project, while still mirroring the modules they verify.

## 5. Data flow example: product listing

1. A customer opens the products page.
2. React Router renders the product-listing page.
3. The page calls a function in `client/src/api/`.
4. Axios sends `GET /api/v1/products` with search or filter query parameters.
5. Express matches the request in `server/src/routes/`.
6. Validation middleware checks the query parameters.
7. The controller passes the request data to the product service.
8. The service applies business rules and asks the Product model for records.
9. Mongoose queries MongoDB.
10. The API returns a JSON response with products and pagination metadata.
11. React stores the result in component state and renders reusable product
    cards.

One-way data flow keeps the browser independent from database details and gives
the server control over accepted input and returned data.

## 6. Request lifecycle

Every API request should follow a predictable lifecycle:

```text
Incoming request
  -> global middleware
  -> matching route
  -> authentication/authorization when required
  -> validation
  -> controller
  -> service
  -> Mongoose model
  -> MongoDB
  -> controller response
  -> centralized error middleware if anything fails
```

For example, an admin product creation request will eventually look like:

```http
POST /api/v1/products
Content-Type: application/json
Authorization: Bearer <token>
```

The server will authenticate the user, verify the admin role, validate the
payload, create the product, and return `201 Created`. The client will then
update the interface from the returned JSON.

## 7. API conventions

- All application endpoints use the `/api/v1` prefix.
- Resources use plural nouns, such as `/products` and `/orders`.
- HTTP methods express actions: GET, POST, PUT, PATCH, and DELETE.
- Successful responses and errors use consistent JSON shapes.
- Correct HTTP status codes communicate outcomes.
- Filtering, search, sorting, and pagination use query parameters.
- Secrets and database credentials stay in environment variables.

Versioning the API now allows a future `/api/v2` without immediately breaking
an existing deployed client.

## 8. Initial domain boundaries

- **Catalog:** products, categories, brands, search, and filtering.
- **Identity:** users, login, registration, and roles.
- **Cart:** selected items, quantities, and persistence.
- **Orders:** checkout snapshots, totals, status, and history.
- **Admin:** catalog, inventory, and order-management workflows.

These are logical boundaries inside one Express application, not separate
microservices. A modular monolith is the right tradeoff for AudioAura: it
provides clean separation without the deployment and networking complexity of
distributed services.

## 9. Important design decisions

### One repository

The frontend and backend evolve together and share one Git history. They remain
separate applications so they can later deploy independently to Vercel and
Render.

### REST rather than direct database access

The API is a security and business-rule boundary. It prevents the client from
controlling database operations and allows other clients to use the same
backend later.

### Service layer

Simple CRUD can appear to work with route-to-model code, but ecommerce actions
quickly span multiple models. The service layer gives inventory and order rules
a stable home.

### Modular monolith

Microservices would add operational complexity without helping this project's
current scale. Clear modules inside one backend provide most of the structural
benefit and are easier to understand and deploy.

