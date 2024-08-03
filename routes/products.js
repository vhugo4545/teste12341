const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Listar todos os produtos
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Buscar um produto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

// Criar novo produto
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produto deletado' });
});

module.exports = router;
