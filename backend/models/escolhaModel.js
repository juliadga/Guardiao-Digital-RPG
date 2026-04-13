const db = require('./db');

exports.salvarEscolha = (dados, callback) => {
    const { usuario_id, capitulo_id, opcao_id } = dados;

    const sql = `
        INSERT INTO escolhas_jogador (usuario_id, capitulo_id, opcao_id)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [usuario_id, capitulo_id, opcao_id], callback);
};
