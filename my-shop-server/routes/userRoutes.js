const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// ראוט שמוגן בטוקן
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Welcome!', userId: req.user.id });
});

module.exports = router; 