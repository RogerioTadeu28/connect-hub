const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Testa a conexão com o banco (opcional, mas ajuda a identificar erros)
prisma.$connect()
  .then(() => console.log('✅ Banco de dados conectado com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao banco:', err.message));

module.exports = prisma;