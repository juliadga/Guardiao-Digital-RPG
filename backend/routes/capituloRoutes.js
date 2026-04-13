const express = require('express');
const router = express.Router();
const capituloController = require('../controllers/capituloController');

router.get('/:id', capituloController.buscarCapitulo);

module.exports = router;
