const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  cost: Number,
  price: Number,
  isUnitary: Boolean, // Campo que indica se é unitário (true) ou por convidado (false)
});

module.exports = mongoose.model('Product', productSchema);
