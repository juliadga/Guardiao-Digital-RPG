const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'rpg_seguranca_digital'
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar no banco:", err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

module.exports = db;
