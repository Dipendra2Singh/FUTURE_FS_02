const express = require('express');
const { pool } = require('../db/database');
const { autoDownloadProductImage } = require('../utils/imageDownloader');
const router = express.Router();

// Download images for all products
router.post('/download-all', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, image FROM products');
    const products = result.rows;
    
    let downloadedCount = 0;
    
    for (const product of products) {
      const downloadedImagePath = await autoDownloadProductImage(product.name, product.id);
      
      if (downloadedImagePath) {
        await pool.query(
          'UPDATE products SET image = $1 WHERE id = $2',
          [downloadedImagePath, product.id]
        );
        downloadedCount++;
      }
    }
    
    res.json({ 
      message: `Downloaded ${downloadedCount} images successfully`,
      total: products.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download image for specific product
router.post('/download/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM products WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = result.rows[0];
    const downloadedImagePath = await autoDownloadProductImage(product.name, product.id);
    
    if (downloadedImagePath) {
      await pool.query(
        'UPDATE products SET image = $1 WHERE id = $2',
        [downloadedImagePath, product.id]
      );
      
      res.json({ 
        message: `Image downloaded for ${product.name}`,
        imagePath: downloadedImagePath 
      });
    } else {
      res.status(500).json({ message: 'Failed to download image' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;