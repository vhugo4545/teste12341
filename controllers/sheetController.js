const fetch = require('node-fetch');
const csv = require('csvtojson');

// Controller para acessar os dados da planilha e retornar como JSON
exports.getSheetData = async (req, res) => {
  try {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT73jfvDoLyAUJrZf4uHNQnSOXMFKtOu_pxLo4Kh5nqFHAFERHwpqN_72wGtHJdRu_FVJtFZShLiKU_/pub?gid=0&single=true&output=csv'; // Substitua pelo seu link de CSV

    const response = await fetch(url);
    const csvData = await response.text();

    // Converter CSV para JSON
    const jsonData = await csv().fromString(csvData);

    // Filtrar linhas e colunas vazias
    const cleanedData = jsonData.filter(row => 
      Object.values(row).some(value => value.trim() !== '')
    );

    res.json(cleanedData);
  } catch (error) {
    console.error('Erro ao acessar a planilha:', error);
    res.status(500).send('Erro ao acessar a planilha');
  }
};
