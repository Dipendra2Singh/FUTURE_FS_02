// 1. Import Packages
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const cors = require('cors');
const { pool, createTables } = require('./db/database');

// 2. Set up App and Database Client
const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    /^https:\/\/shopme-frontend-.*-harshrajthakor31s-projects\.vercel\.app$/,
    'https://shopme-frontend-harshrajthakor31s-projects.vercel.app',
    /^https:\/\/shopme-frontend-.*\.vercel\.app$/,
    'https://shopme-app-2024.vercel.app',
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/simple-admin', require('./routes/simple-admin'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'ShopMe Ecommerce Backend API', status: 'running' });
});

// Seed data function
const seedData = async () => {
  try {
    // Check if products already exist
    const existingProducts = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(existingProducts.rows[0].count) > 0) {
      console.log('✅ Products already exist, skipping seed');
      return;
    }
    
    console.log('🌱 Seeding product data...');
    // Seed new data only if table is empty
      const products = [
        // Electronics - Popular
        ['iPhone 15 Pro', 999, '/images/iphone-15-pro.jpg', 'popular', 'Latest iPhone with A17 Pro chip and titanium design', 50],
        ['Samsung Galaxy S24', 899, '/images/samsung-galaxy-s24.jpg', 'popular', 'Flagship Android phone with AI features', 45],
        ['MacBook Air M3', 1299, '/images/macbook-air-m3.jpg', 'popular', '13-inch laptop with M3 chip and all-day battery', 30],
        ['AirPods Pro 2', 249, '/images/airpods-pro-2.jpg', 'popular', 'Wireless earbuds with active noise cancellation', 100],
        ['iPad Pro 12.9', 1099, '/images/ipad-pro.jpg', 'popular', 'Professional tablet with M2 chip and Liquid Retina display', 25],
        
        // Fashion - Popular
        ['Nike Air Max 270', 150, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', 'popular', 'Comfortable running shoes with Max Air cushioning', 75],
        ['Levi\'s 501 Jeans', 89, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop', 'popular', 'Classic straight-fit jeans in premium denim', 120],
        ['Adidas Hoodie', 65, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop', 'popular', 'Comfortable cotton hoodie with iconic 3-stripes', 90],
        
        // Home & Kitchen - Popular
        ['Instant Pot Duo', 79, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 'popular', '7-in-1 electric pressure cooker for quick meals', 60],
        ['Dyson V15 Vacuum', 749, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 'popular', 'Cordless vacuum with laser dust detection', 35],
        
        // Electronics - Regular Products
        ['Sony WH-1000XM5', 399, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', 'product', 'Premium noise-canceling wireless headphones', 40],
        ['Nintendo Switch OLED', 349, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop', 'product', 'Gaming console with vibrant OLED screen', 55],
        ['Apple Watch Series 9', 399, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=300&fit=crop', 'product', 'Advanced smartwatch with health monitoring', 70],
        ['Dell XPS 13', 999, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', 'product', 'Ultra-thin laptop with InfinityEdge display', 20],
        ['Canon EOS R6', 2499, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop', 'product', 'Full-frame mirrorless camera for professionals', 15],
        ['Samsung 55" QLED TV', 1299, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', 'product', '4K Smart TV with Quantum Dot technology', 25],
        ['Bose SoundLink', 149, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop', 'product', 'Portable Bluetooth speaker with rich sound', 80],
        
        // Fashion - Regular Products
        ['Ray-Ban Aviators', 154, '/assets/img/rayban-sunglasses.jpg', 'product', 'Classic aviator sunglasses with UV protection', 65],
        ['North Face Jacket', 199, '/assets/img/northface-jacket.jpg', 'product', 'Waterproof outdoor jacket for all weather', 45],
        ['Converse Chuck Taylor', 65, '/assets/img/converse-shoes.jpg', 'product', 'Iconic canvas sneakers in classic high-top style', 100],
        ['Polo Ralph Lauren Shirt', 89, '/assets/img/polo-shirt.jpg', 'product', 'Classic polo shirt in premium cotton', 85],
        ['Timex Weekender Watch', 45, '/assets/img/timex-watch.jpg', 'product', 'Casual watch with easy-to-read dial', 120],
        
        // Home & Kitchen - Regular Products
        ['KitchenAid Stand Mixer', 379, '/assets/img/kitchenaid-mixer.jpg', 'product', 'Professional stand mixer for baking enthusiasts', 30],
        ['Ninja Blender', 99, '/assets/img/ninja-blender.jpg', 'product', 'High-speed blender for smoothies and shakes', 50],
        ['Roomba i7+', 599, '/assets/img/roomba.jpg', 'product', 'Smart robot vacuum with automatic dirt disposal', 25],
        ['Keurig K-Elite', 169, '/assets/img/keurig-coffee.jpg', 'product', 'Single-serve coffee maker with multiple brew sizes', 40],
        ['Philips Air Fryer', 129, '/assets/img/air-fryer.jpg', 'product', 'Healthy cooking with rapid air technology', 60],
        
        // Sports & Outdoors
        ['Yeti Rambler Tumbler', 35, '/assets/img/yeti-tumbler.jpg', 'product', 'Insulated stainless steel tumbler keeps drinks cold', 150],
        ['Fitbit Charge 5', 179, '/assets/img/fitbit.jpg', 'product', 'Advanced fitness tracker with built-in GPS', 75],
        ['Coleman Camping Tent', 149, '/assets/img/coleman-tent.jpg', 'product', '4-person dome tent for outdoor adventures', 35],
        ['Wilson Tennis Racket', 89, '/assets/img/wilson-racket.jpg', 'product', 'Professional tennis racket for all skill levels', 40],
        
        // Books & Media
        ['Kindle Paperwhite', 139, '/assets/img/kindle.jpg', 'product', 'Waterproof e-reader with adjustable warm light', 90],
        ['AirPods Max', 549, '/assets/img/airpods-max.jpg', 'product', 'Over-ear headphones with spatial audio', 20],
        
        // Beauty & Personal Care
        ['Oral-B Electric Toothbrush', 89, '/assets/img/oral-b-toothbrush.jpg', 'product', 'Rechargeable toothbrush with pressure sensor', 70],
        ['Neutrogena Face Wash', 12, '/assets/img/neutrogena-facewash.jpg', 'product', 'Daily facial cleanser for all skin types', 200],
        
        // Toys & Games
        ['LEGO Creator Set', 79, '/assets/img/lego-set.jpg', 'product', 'Building set with 500+ pieces for creative play', 45],
        ['Monopoly Board Game', 25, '/assets/img/monopoly.jpg', 'product', 'Classic family board game for 2-8 players', 80]
      ];
      
      for (const product of products) {
        await pool.query(
          'INSERT INTO products (name, price, image, category, description, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6)',
          product
        );
      }
      console.log(`✅ ${products.length} products inserted successfully`);
      
      // Check if coupons exist before seeding
      const existingCoupons = await pool.query('SELECT COUNT(*) FROM coupons');
      if (parseInt(existingCoupons.rows[0].count) === 0) {
        const coupons = [
          ['WELCOME10', 'percentage', 10, 0, 5, null, '2025-12-31 23:59:59'],
          ['SAVE20', 'fixed', 20, 100, null, 100, '2025-06-30 23:59:59'],
          ['NEWUSER', 'percentage', 15, 50, 10, 50, '2025-12-31 23:59:59']
        ];
        
        for (const coupon of coupons) {
          await pool.query(
            'INSERT INTO coupons (code, discount_type, discount_value, minimum_amount, max_discount, usage_limit, expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            coupon
          );
        }
        console.log('✅ Sample coupons seeded');
      } else {
        console.log('✅ Coupons already exist, skipping seed');
      }
      
      // Create admin user if not exists
      const adminExists = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@shopme.com']);
      if (adminExists.rows.length === 0) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await pool.query(
          'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
          ['Admin', 'admin@shopme.com', hashedPassword, 'admin']
        );
        console.log('✅ Admin user created: admin@shopme.com / admin123');
      } else {
        // Update existing user to admin role
        await pool.query(
          'UPDATE users SET role = $1 WHERE email = $2',
          ['admin', 'admin@shopme.com']
        );
        console.log('✅ Admin user role updated');
      }
  } catch (error) {
    console.error('❌ Database seeding error:', error.message);
  }
};

// CORRECTED STARTUP LOGIC
const startServer = async () => {
  try {
    console.log('🚀 Starting ShopMe Backend Server...');
    
    // 1. Connect to the database and create tables first
    await createTables();
    await seedData();
    console.log('✅ Database initialized successfully');

    // 2. If database is ready, then start the server
    app.listen(PORT, () => {
      console.log(`✅ Backend server running on http://localhost:${PORT}`);
      console.log('📊 API Endpoints:');
      console.log('  - Products: http://localhost:8001/api/products');
      console.log('  - Auth: http://localhost:8001/api/auth');
      console.log('  - Cart: http://localhost:8001/api/cart');
      console.log('  - Orders: http://localhost:8001/api/orders');

      console.log('  - Reviews: http://localhost:8001/api/reviews');
      console.log('  - Coupons: http://localhost:8001/api/coupons');
      console.log('  - Admin: http://localhost:8001/api/simple-admin');
    });
  } catch (error) {
    console.error('❌ Fatal error during startup:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Start the application
startServer();