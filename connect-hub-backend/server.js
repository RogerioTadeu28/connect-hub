require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares essenciais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Para ler JSON no corpo das requisições

// Rota de saúde (teste)
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Connect Hub API is running!' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});