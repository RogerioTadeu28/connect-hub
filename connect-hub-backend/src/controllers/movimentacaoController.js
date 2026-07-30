const prisma = require('../prisma');

exports.create = async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria, data } = req.body;
    const userId = req.userId;

    const mov = await prisma.movimentacao.create({
      data: {
        descricao,
        valor: parseFloat(valor),
        tipo,
        categoria,
        data: new Date(data),
        userId
      }
    });
    res.status(201).json(mov);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar movimentação' });
  }
};

exports.list = async (req, res) => {
  try {
    const userId = req.userId;
    const { descricao, categoria } = req.query;

    const where = { userId };
    if (descricao) where.descricao = { contains: descricao, mode: 'insensitive' };
    if (categoria) where.categoria = categoria;

    const movs = await prisma.movimentacao.findMany({
      where,
      orderBy: { data: 'desc' }
    });
    res.json(movs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar movimentações' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { descricao, valor, tipo, categoria, data } = req.body;

    const existing = await prisma.movimentacao.findFirst({
      where: { id: Number(id), userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Movimentação não encontrada ou não autorizada' });
    }

    const updated = await prisma.movimentacao.update({
      where: { id: Number(id) },
      data: {
        descricao,
        valor: parseFloat(valor),
        tipo,
        categoria,
        data: new Date(data)
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar movimentação' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existing = await prisma.movimentacao.findFirst({
      where: { id: Number(id), userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Movimentação não encontrada ou não autorizada' });
    }

    await prisma.movimentacao.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar movimentação' });
  }
};