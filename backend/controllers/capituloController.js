const capituloModel = require('../models/capituloModel');

exports.buscarCapitulo = (req, res) => {
    const id = req.params.id;

    capituloModel.getCapituloById(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro no servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Capítulo não encontrado" });
        }

        const capitulo = {
            id: results[0].id,
            titulo: results[0].titulo,
            situacao: results[0].situacao_narrativa,
            opcoes: results.map(row => ({
                id: row.opcao_id,
                texto: row.texto_escolha,
                consequencia: row.consequencia_narrativa,
                feedback: row.feedback_educativo,
                seguro: row.e_seguro
            }))
        };

        res.json(capitulo);
    });
};
