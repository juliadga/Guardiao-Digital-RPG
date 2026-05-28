const express = require('express');
const { carregarProgresso, salvarProgresso } = require('../controllers/userController');

const router = express.Router();

router.get('/progresso', progressoController.carregarProgresso);
router.post('/progresso', progressoController.salvarProgresso);

module.exports = router;