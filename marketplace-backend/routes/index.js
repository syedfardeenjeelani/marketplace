const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models/Product');

// Product Routes
router.get('/products', async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message 
    });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const productId = await Product.create(req.body);
    res.status(201).json({ id: productId });
  } catch (error) {
    res.status(400).json({
      error: 'Product creation failed',
      details: error.message
    });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const updatedId = await Product.update(req.params.id, req.body);
    res.json({ id: updatedId });
  } catch (error) {
    res.status(400).json({
      error: 'Product update failed',
      details: error.message
    });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Delete failed',
      details: error.message
    });
  }
});

// Order Routes
router.post('/orders', async (req, res) => {
  try {
    const orderId = await Order.create(req.body);
    res.status(201).json({ id: orderId });
  } catch (error) {
    res.status(400).json({
      error: 'Order creation failed',
      details: error.message
    });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.getByUser(req.query.email);
    res.json(orders);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

module.exports = router;