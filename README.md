# 🎧 AudioAura

> A modern full-stack e-commerce platform for premium audio products built with the MERN stack.

**🌐 Live Demo:** https://audioauro.up.railway.app/

---

## 📖 Overview

AudioAura is a full-stack e-commerce web application focused on premium audio products such as headphones, earbuds, speakers, DACs, microphones, and soundbars.

The project was developed to simulate a production-ready online store by implementing modern frontend development practices, RESTful backend architecture, secure authentication, database management, and cloud deployment.

Unlike a basic CRUD application, AudioAura emphasizes scalability, clean architecture, responsive design, and real-world e-commerce workflows.

---

# ✨ Features

### Customer Features

* Browse products with a modern responsive interface
* Search and filter products
* Sort products by multiple criteria
* View detailed product information
* Add products to shopping cart
* User authentication
* Secure login using JWT
* Place orders
* View order history
* Responsive UI for desktop and mobile

---

### Admin Features

* Product management
* Add new products
* Update existing products
* Delete products
* Inventory management
* Protected admin routes
* Secure authorization middleware

---

## 🛠 Tech Stack

### Frontend

* React 19
* Vite
* React Router
* Axios
* Framer Motion
* CSS

---

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* REST API

---

### Deployment

* Railway (Frontend)
* Railway (Backend)
* MongoDB Atlas (Database)

---

# 🏗 Project Architecture

```
AudioAura_v3
│
├── client/
│   ├── React
│   ├── Components
│   ├── Pages
│   ├── API Layer
│   └── Routing
│
├── server/
│   ├── Controllers
│   ├── Models
│   ├── Routes
│   ├── Middleware
│   ├── Utilities
│   ├── Database Config
│   └── Seed Scripts
│
└── MongoDB Atlas
```

---

# 📂 Folder Structure

```
client/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── layouts/
│   ├── context/
│   └── assets/

server/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── data/

```

---

# 🔒 Authentication

AudioAura uses JWT-based authentication.

Authentication Flow:

```
User Login
      │
      ▼
Server validates credentials
      │
      ▼
JWT Generated
      │
      ▼
Token stored on client
      │
      ▼
Protected API Requests
```

---

# 🗄 Database

MongoDB Atlas is used as the cloud database.

Collections include:

* Users
* Products
* Orders
* Cart
* Reviews
* Coupons
* Store Settings

---

# 🌐 REST API

Example Endpoints

```
GET    /api/products
GET    /api/products/:id
GET    /api/products/slug/:slug

POST   /api/auth/login
POST   /api/auth/register

GET    /api/cart
POST   /api/cart

GET    /api/orders
POST   /api/orders

POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

---

# ⚡ Key Highlights

* Modular backend architecture
* RESTful API design
* JWT Authentication
* MongoDB Atlas integration
* Cloud deployment
* Responsive UI
* Component-based React architecture
* Environment variable management
* Protected routes
* Role-based authorization
* Product seeding scripts
* Error handling middleware
* Scalable folder structure

---

# 🚀 Local Setup

Clone the repository

```bash
git clone https://github.com/sujit-2005/AudioAura_v3.git
```

Move into the project

```bash
cd AudioAura_v3
```

Install dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

## Environment Variables

### Server (.env)

```
PORT=5000

MONGODB_URI=<your_mongodb_connection_string>

JWT_SECRET=<your_secret>

CLIENT_URL=http://localhost:5173
```

### Client (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

Run Backend

```bash
cd server
npm run dev
```

Run Frontend

```bash
cd client
npm run dev
```

---

# 📸 Screenshots

You can add screenshots here:

```
Home Page

Product Listing

Product Details

Shopping Cart

Authentication

Orders

Admin Dashboard
```

---

# 💡 What I Learned

Developing AudioAura helped me gain practical experience with:

* Building scalable React applications
* Designing RESTful APIs
* JWT authentication and authorization
* MongoDB schema design
* Express middleware architecture
* Cloud deployment using Railway
* MongoDB Atlas integration
* API consumption using Axios
* Production environment configuration
* Git and GitHub workflow

---

# 📌 Future Improvements

* Payment Gateway Integration
* Wishlist
* Product Reviews
* Product Recommendations
* Email Notifications
* Order Tracking
* Image Uploads
* Dashboard Analytics
* Coupon Management
* Dark / Light Theme
* CI/CD Pipeline
* Unit & Integration Testing

---

# 👨‍💻 Developer

**Venkat Sujit**

Cybersecurity & Full Stack Developer

* Passionate about building secure, scalable web applications.
* Interested in Full Stack Development, Cybersecurity, and Backend Engineering.

GitHub:
https://github.com/sujit-2005

LinkedIn:
https://www.linkedin.com/in/venkat-sujit-3b3a562b6

---

# ⭐ If you found this project useful

Please consider giving the repository a **Star ⭐**. It helps others discover the project and motivates further development.

---

## 📄 License

This project is intended for educational, portfolio, and learning purposes.
