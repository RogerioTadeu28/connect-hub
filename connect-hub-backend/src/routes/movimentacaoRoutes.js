const express = require('express');
const { create, list, update, delete: del } = require('../controllers/movimentacaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', list);
router.put('/:id', update);
router.delete('/:id', del);

module.exports = router;