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

// Create order from cart
router.post('/create', verifyToken, async (req, res) => {
  const { shipping_address, phone } = req.body;
  console.log('Creating order for user:', req.user.userId, 'with data:', { shipping_address, phone });
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get cart items
    const cartResult = await client.query(`
      SELECT c.product_id, c.quantity, p.price, p.stock_quantity, p.name
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [req.user.userId]);
    
    console.log('Cart items found:', cartResult.rows.length);
    
    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total
    const total = cartResult.rows.reduce((sum, item) => 
      sum + (item.quantity * parseFloat(item.price)), 0
    );
    
    console.log('Order total:', total);
    
    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_amount, shipping_address, phone)
      VALUES ($1, $2, $3, $4) RETURNING id
    `, [req.user.userId, total, shipping_address, phone]);
    
    const orderId = orderResult.rows[0].id;
    console.log('Order created with ID:', orderId);
    
    // Create order items and update stock
    for (const item of cartResult.rows) {
      if (item.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}, Requested: ${item.quantity}` });
      }
      
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.product_id, item.quantity, item.price]);
      
      await client.query(`
        UPDATE products SET stock_quantity = stock_quantity - $1
        WHERE id = $2
      `, [item.quantity, item.product_id]);
    }
    
    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.userId]);
    
    await client.query('COMMIT');
    console.log('Order completed successfully');
    res.json({ message: 'Order created successfully', orderId });
  } catch (error) {
    console.error('Order creation error:', error.message);
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'image', p.image
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'image', p.image
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `, [req.params.id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (for admin use)
router.put('/:id/status', verifyToken, async (req, res) => {
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

module.exports = router;