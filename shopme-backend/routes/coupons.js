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

// Validate coupon
router.post('/validate', verifyToken, async (req, res) => {
  const { code, total_amount } = req.body;
  
  try {
    const result = await pool.query(`
      SELECT * FROM coupons 
      WHERE code = $1 AND is_active = true 
      AND expires_at > NOW() 
      AND (usage_limit IS NULL OR usage_count < usage_limit)
      AND minimum_amount <= $2
    `, [code.toUpperCase(), total_amount]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }
    
    const coupon = result.rows[0];
    let discount = 0;
    
    if (coupon.discount_type === 'percentage') {
      discount = (total_amount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }
    
    res.json({
      valid: true,
      coupon: coupon,
      discount: discount,
      final_amount: total_amount - discount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply coupon (increment usage)
router.post('/apply', verifyToken, async (req, res) => {
  const { code } = req.body;
  
  try {
    await pool.query(
      'UPDATE coupons SET usage_count = usage_count + 1 WHERE code = $1',
      [code.toUpperCase()]
    );
    res.json({ message: 'Coupon applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;