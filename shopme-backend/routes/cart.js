const express = require('express');
const { pool } = require('../db/database');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.quantity, p.name, p.price, p.image, p.stock_quantity,
             (c.quantity * p.price) as subtotal
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  try {
    // Check if item already in cart
    const existing = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, product_id]
    );
    
    if (existing.rows.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, req.user.userId, product_id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [req.user.userId, product_id, quantity]
      );
    }
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/update/:id', verifyToken, async (req, res) => {
  const { quantity } = req.body;
  try {
    await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3',
      [quantity, req.params.id, req.user.userId]
    );
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;