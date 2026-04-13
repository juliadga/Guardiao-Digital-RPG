const express = require('express');
const router = express.Router();
const escolhaController = require('../controllers/escolhaController');

router.post('/', escolhaController.registrarEscolha);

module.exports = router;
