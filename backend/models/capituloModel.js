const db = require('./db');

exports.getCapituloById = (id, callback) => {
    const sql = `
        SELECT c.*, o.id AS opcao_id, o.texto_escolha, 
               o.consequencia_narrativa, o.feedback_educativo, o.e_seguro
        FROM capitulos c
        LEFT JOIN opcoes o ON c.id = o.capitulo_id
        WHERE c.id = ?
    `;

    db.query(sql, [id], callback);
};
