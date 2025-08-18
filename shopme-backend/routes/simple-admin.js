const express = require('express');
const { pool } = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded admin check
  if (email === 'admin@shopme.com' && password === 'admin123') {
    const token = jwt.sign({ 
      userId: 1, 
      email: 'admin@shopme.com', 
      role: 'admin' 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: 1, 
        name: 'Admin', 
        email: 'admin@shopme.com', 
        role: 'admin' 
      } 
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email,
             json_agg(
               json_build_object(
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, req.params.id]
    );
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  const { name, price, description, stock_quantity, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3, stock_quantity = $4, is_active = $5 WHERE id = $6',
      [name, price, description, stock_quantity, is_active, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;