const { PrismaClient } = require('@prisma/client');

let prisma = null;

function getPrismaClient() {
  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
      console.log('✅ Prisma Client inicializado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao inicializar Prisma Client:', error.message);
      // Retorna um cliente vazio para não quebrar a aplicação
      return null;
    }
  }
  return prisma;
}

module.exports = getPrismaClient;