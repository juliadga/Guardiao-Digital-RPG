import { Router } from 'express';
import { IndexController } from '../controllers';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app) {
    app.use('/', router);
    router.get('/', indexController.getIndex.bind(indexController));
}

const express = require('express');
const router = express.Router();
const escolhaController = require('../controllers/escolhaController');

router.post('/', escolhaController.registrarEscolha);

module.exports = router;
