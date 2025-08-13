const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// ✅ קבלת כל המשתמשים (עם חיפוש קל + פגינציה בסיסית)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { q = '', page = 1, limit = 20 } = req.query;
    const filter = q
      ? { $or: [
          { name:  { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ] }
      : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter)
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users', detail: e.message });
  }
});

// ✅ יצירת משתמש (אדמין)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin = false } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, isAdmin: !!isAdmin });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create user', detail: e.message });
  }
});

// ✅ עדכון משתמש (אדמין)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const update = {};

    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (typeof isAdmin === 'boolean') update.isAdmin = isAdmin;
    if (password) update.password = await bcrypt.hash(password, 10);

    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update user', detail: e.message });
  }
});

// ✅ מחיקת משתמש (אדמין) – מונעים למחוק את עצמך
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Admin cannot delete own account' });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete user', detail: e.message });
  }
});

module.exports = router;
