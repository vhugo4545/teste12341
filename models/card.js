const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  photo: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true },
  validity: { type: Date, required: true },
  effectiveYear: { type: Number, required: true },
  isActive: { type: Boolean, default: true }  // Adicionando o campo 'isActive' com padrão como true
});

module.exports = mongoose.model('Card', cardSchema);
