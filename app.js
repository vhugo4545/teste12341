const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch'); // Assegure-se de ter a versão 2.x para compatibilidade CommonJS

const app = express();

// Routers
const productRouter = require('./routes/products.js');
const cardRouter = require('./routes/cards.js');

// String de conexão com o MongoDB Atlas
const mongoUri = 'mongodb+srv://Primore:Primore_1969@cluster0.g1hwzv9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Conectar ao MongoDB Atlas
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas', err));

// Configurar middleware
app.use(cors()); // Adicionando CORS
app.use(bodyParser.json()); // Para parsear o corpo das requisições em JSON
app.use(express.static('public')); // Servir arquivos estáticos do diretório 'public'

// Usar routers
app.use('/api/products', productRouter);
app.use('/api/cards', cardRouter);

// Servir o arquivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para enviar dados via fetch para um webhook externo
app.post('/submit', async (req, res) => {
  const data = req.body;

  try {
    const response = await fetch('https://hooks.zapier.com/hooks/catch/12161332/3v92279/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      res.send('Data sent successfully');
    } else {
      res.status(500).send('Failed to send data');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).send('Error in sending data');
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
