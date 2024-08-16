const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');

// Definir a rota para obter os dados da planilha
router.get('/sheet-data', sheetController.getSheetData);

module.exports = router;
