const db = require('../models/db');

exports.salvarProgresso = (req, res) => {
    const { nome, capitulosConcluidos, escolhas } = req.body;

    const sql = `
        INSERT INTO progresso_jogador (usuario_id, capitulos_concluidos, data_atualizacao)
        VALUES ((SELECT id FROM usuarios WHERE nome = ?), ?, NOW())
        ON DUPLICATE KEY UPDATE capitulos_concluidos = ?, data_atualizacao = NOW()
    `;

    db.query(sql, [nome, capitulosConcluidos, capitulosConcluidos], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao salvar progresso' });
        }

        res.status(200).json({ message: 'Progresso salvo com sucesso!' });
    });
};

exports.carregarProgresso = (req, res) => {
    const { nome } = req.query;

    const sql = `
        SELECT p.capitulos_concluidos, e.*
        FROM progresso_jogador p
        JOIN escolhas_jogador e ON p.usuario_id = e.usuario_id
        WHERE p.usuario_id = (SELECT id FROM usuarios WHERE nome = ?)
    `;

    db.query(sql, [nome], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao carregar progresso' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Progresso não encontrado' });
        }

        const progresso = {
            nome,
            capitulosConcluidos: results[0].capitulos_concluidos,
            escolhas: results.map(row => ({
                decisao: row.texto_escolha,
                seguro: row.e_seguro,
                aprendizado: row.feedback_educativo
            }))
        };

        res.json(progresso);
    });
};