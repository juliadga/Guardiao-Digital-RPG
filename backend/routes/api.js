const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');

const router = express.Router();

router.get('/progresso', progressoController.carregarProgresso);
router.post('/progresso', progressoController.salvarProgresso);

module.exports = router;