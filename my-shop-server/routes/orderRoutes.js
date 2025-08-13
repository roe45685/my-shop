const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');              
const Order = require('../models/Order');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin'); 

// יצירת הזמנה (משתמש מחובר)
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('🔔 POST /api/orders by:', req.user);
    console.log('📦 payload:', req.body);

    const { items } = req.body;

    // ולידציה בסיסית
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // בדיקת כל פריט
    for (const it of items) {
      if (!it.product || !mongoose.Types.ObjectId.isValid(it.product)) {
        return res.status(400).json({ message: 'Invalid product id in items' });
      }
      if (!it.quantity || it.quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity in items' });
      }
    }

    const newOrder = new Order({
      customer: req.user.id, // מתוך ה-JWT
      items
    });

    const saved = await newOrder.save();
    console.log('✅ Order saved:', saved._id);
    return res.status(201).json(saved);

  } catch (error) {
    console.error('❌ Error creating order:', error);
    return res.status(500).json({ message: 'Internal error creating order', detail: error.message });
  }
});

// קבלת ההזמנות של המשתמש (או כולן אם אדמין)
router.get('/', verifyToken, async (req, res) => {
  try {
    const query = req.user.isAdmin ? {} : { customer: req.user.id };
    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('items.product');

    return res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return res.status(500).json({ message: 'Internal error fetching orders', detail: error.message });
  }
})


// ✅ אדמין: עדכון סטטוס הזמנה
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'pending' | 'paid' | 'shipped' | 'canceled'
    if (!['pending', 'paid', 'shipped', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email').populate('items.product');
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update status', detail: e.message });
  }
});

// ✅ אדמין: ביטול/מחיקת הזמנה (אופציונלי – מחיקה קשיחה)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete order', detail: e.message });
  }
});



module.exports = router;
