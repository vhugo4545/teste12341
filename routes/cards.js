const express = require('express');
const router = express.Router();
const Card = require('../models/card');

// POST - Criar um novo card
router.post('/', async (req, res) => {
  const card = new Card({
    photo: req.body.photo,
    headline: req.body.headline,
    description: req.body.description,
    validity: req.body.validity,
    effectiveYear: req.body.effectiveYear,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true  // Inclui 'isActive' com padrão verdadeiro
  });

  try {
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Buscar todos os cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Atualizar o status de um card
router.put('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(id, { isActive: req.body.isActive }, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
