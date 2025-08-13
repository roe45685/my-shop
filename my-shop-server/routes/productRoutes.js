// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

/**
 * GET /api/products
 * פרמטרים:
 * q     - טקסט חיפוש בשם/תיאור (לא רגיש לאותיות)
 * page  - מספר עמוד (1..)
 * limit - כמה פריטים בעמוד (ברירת מחדל 12, מקסימום 100)
 * sort  - שדה למיון (ברירת מחדל createdAt)
 * dir   - 'asc' | 'desc' (ברירת מחדל 'desc')
 */
router.get('/', async (req, res) => {
  try {
    const {
      q = '',
      page = 1,
      limit = 12,
      sort = 'createdAt',
      dir = 'desc',
    } = req.query;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * lim;
    const sortSpec = { [sort]: dir === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortSpec).skip(skip).limit(lim),
      Product.countDocuments(filter),
    ]);

    return res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / lim),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// קבלת מוצר בודד לפי ID (פתוח לכולם)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// יצירת מוצר חדש (רק למנהלים)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const newProduct = new Product({ name, price, description, image });
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// עדכון מוצר (רק למנהלים)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, image },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// מחיקת מוצר (רק למנהלים)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
