const express = require('express');
const { pool } = require('../db/database');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

// Get wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.id, p.* FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1 AND p.is_active = true
    `, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post('/add', verifyToken, async (req, res) => {
  const { product_id } = req.body;
  try {
    const existing = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, product_id]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)',
      [req.user.userId, product_id]
    );
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, parseInt(req.params.productId)]
    );
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;