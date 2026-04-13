const escolhaModel = require('../models/escolhaModel');

exports.registrarEscolha = (req, res) => {
    const { usuario_id, capitulo_id, opcao_id } = req.body;

    if (!usuario_id || !capitulo_id || !opcao_id) {
        return res.status(400).json({
            error: "Dados incompletos"
        });
    }

    escolhaModel.salvarEscolha(req.body, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Erro ao salvar escolha"
            });
        }

        res.status(201).json({
            message: "Escolha salva!",
            id: result.insertId
        });
    });
};
