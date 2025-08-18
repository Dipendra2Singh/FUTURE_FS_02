<<<<<<< HEAD
# 🛒 ShopMe Ecommerce Website - Full Stack Application

## Project Structure
```
ShopMe-Website/
├── shopme-backend/         # Node.js + Express + PostgreSQL (ShopMe Backend)
├── shopme-frontend/        # React + Tailwind CSS (ShopMe Frontend)
├── START_BACKEND.bat       # Start backend server
└── START_FRONTEND.bat      # Start frontend app
```

## Quick Start

### Option 1: Use Batch Files (Recommended)
1. **Double-click `START_BACKEND.bat`** - Starts backend on port 8001
2. **Double-click `START_FRONTEND.bat`** - Starts frontend on port 3000

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd shopme-backend
npm install
npm start

# Terminal 2 - Frontend  
cd shopme-frontend
npm install
npm start
```

## What's Working

✅ **Separated Projects** - Independent frontend and backend  
✅ **Neon PostgreSQL** - Cloud database with your connection  
✅ **Authentication** - Login/Register with JWT tokens  
✅ **Product Catalog** - Auto-seeded product catalog with descriptions and stock  
✅ **Shopping Cart** - Add/remove items, quantity management  
✅ **Order System** - Place orders, order history, order tracking  
✅ **Stock Management** - Real-time inventory tracking  
✅ **Search Functionality** - Search products by name or description  
✅ **CORS Enabled** - Frontend can call backend APIs  
✅ **Responsive Design** - Mobile-friendly ecommerce theme  

## URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8001
- **API Endpoints**:
  - Products: http://localhost:8001/api/products
  - Cart: http://localhost:8001/api/cart
  - Orders: http://localhost:8001/api/orders

## Test Ecommerce Features
1. Visit http://localhost:3000
2. Click "Sign Up" and create account: `test@shopme.com` / `password123`
3. Login and browse products
4. Add products to cart using the cart button 🛒
5. View cart by clicking cart icon in header
6. Proceed to checkout and place order
7. View order history in "My Orders"
8. Use search functionality to find specific products

## Database Tables
- **Provider**: Neon PostgreSQL (Cloud)
- **Tables**: 
  - `users` - User authentication
  - `products` - Product catalog with stock
  - `cart` - Shopping cart items
  - `orders` - Order records
  - `order_items` - Order line items
- **Auto-seeds**: Enhanced product data with descriptions and stock

## New Ecommerce Features

### Backend APIs
- **Cart Management**: Add, update, remove items
- **Order Processing**: Create orders, view history
- **Stock Tracking**: Real-time inventory updates
- **Search**: Find products by name/description

### Frontend Components
- **Shopping Cart**: Slide-out cart with quantity controls
- **Checkout Process**: Order form with shipping details
- **Order History**: View past orders with status
- **Search Bar**: Real-time product search
- **Stock Display**: Show available quantities

The ShopMe website is now a fully functional ecommerce platform! 🛒🛍️
=======
<<<<<<< HEAD
# Employee Management Website

A simple full-stack web application that allows administrators to perform CRUD (Create, Read, Update, Delete) operations on employee records.

## 💻 Features
- Add new employee records
- View all employee records
- Update existing employee information
- Delete employee records

## 🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js

## 📽 Demo
Check out the screen recording: [Watch Demo Video](https://github.com/941-Abhi/Prodigy_2/blob/99df69c7ca3bacdbc9ff7ff85b779d68347cea6a/demo.mp4)

## 🚀 How to Run
1. Clone the repository
2. Run `npm install`
3. Start the server with `npm start`
4. Open your browser and go to `http://localhost:3000`
=======
# PRODIGY_FS_02
>>>>>>> a6447ebb81ec8479ed7ef6be14809ab9a3e710c7
>>>>>>> 9b1c15992161960bf07fe349a00a3d71014cf860
