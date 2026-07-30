require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Connect Hub API is running!' });
});

// Rota de teste de login (sem banco)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Login fictício para teste
  if (email === 'teste@teste.com' && password === '123456') {
    res.json({
      message: 'Login realizado com sucesso',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg1NDI0NTg4LCJleHAiOjE3ODU4MTU2NTV9.test',
      user: { id: 1, name: 'Teste', email: 'teste@teste.com' }
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rota de teste de cadastro (sem banco)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (email && password && name) {
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg1NDI0NTg4LCJleHAiOjE3ODU4MTU2NTV9.test',
      user: { id: 1, name, email }
    });
  } else {
    res.status(400).json({ error: 'Dados incompletos' });
  }
});

// Rota de movimentações (mock)
app.get('/api/movimentacoes', (req, res) => {
  res.json([]);
});

app.post('/api/movimentacoes', (req, res) => {
  res.status(201).json({ id: Date.now(), ...req.body });
});

app.put('/api/movimentacoes/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/movimentacoes/:id', (req, res) => {
  res.status(204).send();
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});