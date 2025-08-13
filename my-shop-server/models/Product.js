const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: { // 🆕 שדה תמונה
    type: String, // כתובת URL של התמונה
    required: false
  }
});

module.exports = mongoose.model('Product', productSchema);
